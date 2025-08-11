import { createPortal } from "react-dom";
import CallControls from "../components/CallControls";
import UserVideoPreview from "../components/UserVideoPreview";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { callStatus, ringing, callInitiated, callHangup } from "../redux/callSlice";
import PeerVideoPreview from "../components/PeerVideoPreview";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import toast from "react-hot-toast";
import { toastMessages } from "@/constants/ToastMessages";
import { useSearchParams } from "react-router";
import ErrorPage from "@/layout/PageNotFoundPage";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import Spinner from "@/components/Spinner";
import useNavigateBackOnCallEnd from "../hooks/useNavigateBackOnCallEnd";

const P2PVideoPage = () => {
  const peerConnectionRef = useRef<RTCPeerConnection>(null);
  const { socket } = useChatSocketProvider();
  const [searchParams] = useSearchParams();

  const dispath = useAppDispatch();
  const callState = useAppSelector((state) => state.call.callStatus);
  const callId = useAppSelector((state) => state.call.callId);
  const clientType = useAppSelector((state) => state.call.clientType);
  const activeAudioDeviceId = useAppSelector((state) => state.call.activeAudioDeviceId);
  const activeVideoDeviceId = useAppSelector((state) => state.call.activeVideoDeviceId);
  const micOn = useAppSelector((state) => state.call.micOn);
  const cameraOn = useAppSelector((state) => state.call.cameraOn);

  const peerId = searchParams.get("peer-id");
  const { httpStatus, isLoading } = usePublicUserProfileQuery(peerId ?? undefined);

  // polite = true => will be forgiving in RTC state collisions (receiver usually  polite)
  const queuedCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const makingOffer = useRef<boolean>(false);
  const isSettingRemoteDescritionPending = useRef<boolean>(false);
  const localStreamRef = useRef<MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const polite = clientType === "callee";

  useNavigateBackOnCallEnd();

  const createOrGetPC = useCallback((): RTCPeerConnection => {
    let pc = peerConnectionRef.current;
    if (pc) return pc;

    pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      console.log("my-ice candidates", event);
      if (!event.candidate || !callId) return;
      socket?.emit("call.ice-candidates", { callId, ice: JSON.stringify(event.candidate) });
    };

    // debounced negotiation handler:
    pc.onnegotiationneeded = async () => {
      try {
        if (makingOffer.current || !callId) return;
        makingOffer.current = true;

        console.log("negotiation-needed-fired");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.emit("call.sdp.offer", {
          callId: callId,
          offerSDP: JSON.stringify(pc.localDescription),
        });
      } catch (err) {
        console.error("negotiationneeded error:", err);
      } finally {
        makingOffer.current = false;
      }
    };

    pc.ontrack = async (event) => {
      console.log("track received:", event.track);
      let stream = remoteStream;
      if (!stream) {
        stream = new MediaStream();
      }

      const exitingVideoTracks = stream.getVideoTracks();
      // CHECK-if this is necessary:remove existing track
      if (exitingVideoTracks.length) {
        for (const track of exitingVideoTracks) {
          stream.removeTrack(track);
          console.log("removing exising video tracks");
        }
      }

      event.track.onended = (t) => {
        console.log("on ended", t);
        setRemoteStream(null);
      };

      stream.addTrack(event.track);
      if (event.track.enabled) setRemoteStream(stream);
      else setRemoteStream(null);
    };

    return pc;
  }, [callId, socket]);

  const flushQueuedCandidates = useCallback(async (pc: RTCPeerConnection) => {
    if (!queuedCandidatesRef.current.length) return;
    for (const c of queuedCandidatesRef.current) {
      try {
        await pc.addIceCandidate(c);
      } catch (error) {
        console.log("error addeding queued ice candidate", error);
      }
    }
  }, []);

  // common socket listeners for caller and callee
  useEffect(() => {
    if (!socket) return;

    const onOffer = async (event: { callId: string; offerSDP: string }) => {
      try {
        if (!peerId || event.callId !== callId) return;
        const pc = createOrGetPC();
        // collision detection
        const offerCollision = makingOffer.current || isSettingRemoteDescritionPending.current;
        if (offerCollision && !polite) {
          console.warn("skipping remote offer because of state collision and impolite role");
          return;
        }

        isSettingRemoteDescritionPending.current = true;
        await pc.setRemoteDescription(JSON.parse(event.offerSDP));
        isSettingRemoteDescritionPending.current = false;

        // flush ice, now that we have remote desc set
        await flushQueuedCandidates(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("call.sdp.answer", { callId, answerSDP: JSON.stringify(answer) });
      } catch (error) {
        isSettingRemoteDescritionPending.current = false;
        console.log("error handling incomming offer ", error);
      }
    };

    const onAnswer = async (event: { callId: string; answerSDP: string }) => {
      try {
        if (event.callId !== callId) return;
        const pc = createOrGetPC();
        // here we since we are only setting remote desc, we might not have conflit of RTC states : double check required
        await pc.setRemoteDescription(JSON.parse(event.answerSDP));
        await flushQueuedCandidates(pc);
      } catch (error) {
        console.error("error while handling incoming answer", error);
      }
    };

    const onRemoteICE = async (event: { callId: string; ice: string }) => {
      try {
        if (event.callId !== callId) return;
        const pc = peerConnectionRef.current;
        const candidate = JSON.parse(event.ice) as RTCIceCandidate;
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(candidate);
        } else {
          queuedCandidatesRef.current.push(candidate);
        }
      } catch (error) {
        console.error("error while setting remote ice-c", error);
      }
    };

    socket.on("call.sdp.offer", onOffer);
    socket.on("call.sdp.answer", onAnswer);
    socket.on("call.ice-candidates", onRemoteICE);

    return () => {
      socket.off("call.sdp.offer", onOffer);
      socket.off("call.sdp.answer", onAnswer);
      socket.off("call.ice-candidates", onRemoteICE);
    };
  }, [callId, createOrGetPC, flushQueuedCandidates, polite, socket]);

  const startLocalMedia = useCallback(
    async (options: {
      video: boolean;
      audio: boolean;
      audioDevicId: string;
      videoDeviceId: string;
    }) => {
      try {
        if (!options.audio && !options.video) {
          console.error("u: cannot request media if both of audio and video is false");
          return;
        }

        if (!options.audioDevicId && !options.videoDeviceId) {
          console.error("no audio or video device selected");
          return;
        }

        const s = await window.navigator.mediaDevices.getUserMedia({
          video: options.video ? { deviceId: { exact: options.videoDeviceId } } : false,
          audio: false,
        });
        stopLocalTracks();
        localStreamRef.current = s;
        const pc = createOrGetPC();

        const vidTracks = s.getVideoTracks();

        if (!vidTracks.length) {
          return;
        }

        setTimeout(() => {
          pc.addTrack(vidTracks[0], s);
          console.log("add stream, fired");
        }, 2 * 1000);
      } catch (error) {
        console.error(`${startLocalMedia.name}:getUserMedia failed `, error);
      }
    },
    [createOrGetPC],
  );

  // caller specific settigs
  useEffect(() => {
    if (!socket || !callId || callState !== "joined" || clientType !== "caller") return;

    (async () => {
      await startLocalMedia({
        video: cameraOn,
        audio: micOn,
        audioDevicId: activeAudioDeviceId,
        videoDeviceId: activeVideoDeviceId,
      });
    })();
  }, [
    activeAudioDeviceId,
    activeVideoDeviceId,
    callId,
    callState,
    cameraOn,
    clientType,
    micOn,
    socket,
    startLocalMedia,
  ]);

  // callerr specif setting
  useEffect(() => {
    if (!socket || !callId || callState !== "joined" || clientType !== "callee") return;

    (async () => {
      await startLocalMedia({
        video: cameraOn,
        audio: micOn,
        videoDeviceId: activeVideoDeviceId,
        audioDevicId: activeAudioDeviceId,
      });
    })();
  }, [
    activeAudioDeviceId,
    activeVideoDeviceId,
    callId,
    callState,
    cameraOn,
    clientType,
    micOn,
    socket,
    startLocalMedia,
  ]);

  if (!peerId) return <ErrorPage message="No recipient" />;
  if (isLoading)
    return (
      <div className="bg-grey-dark-bg absolute inset-0 overflow-clip">
        <div className="flex h-full w-full flex-col items-center justify-center text-white">
          <Spinner />
          <p className="mt-1 text-zinc-400">Initializing</p>
        </div>
      </div>
    );
  if (httpStatus === 404) return <ErrorPage message="Invalid User" />;

  const toggleOtherPerson = () => {
    if (callState == "pending") dispath(callStatus("joined"));
    else dispath(callStatus("pending"));
  };

  const hanedleStartCall = async () => {
    if (!socket) {
      toast.error(toastMessages.CANNOT_START_CALL);
      return;
    }
    try {
      dispath(callInitiated());

      socket.emit("call.initiate", peerId, (res) => {
        if (res.ringing) {
          dispath(ringing({ callId: res.callId }));
        }
      });
    } catch (error) {
      console.log("error starting call", error);
      toast.error(toastMessages.SOMETHING_WENT_WRONG);
      dispath(callStatus("notInitiated"));
    }
  };

  const stopLocalTracks = () => {
    const s = localStreamRef.current;
    if (!s) return;
    s.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch (e) {
        console.error("error closing local stream", e);
      }
    });
    localStreamRef.current = null;
  };

  const handleHandupCall = () => {
    if (!socket || !callId) {
      toast.error(toastMessages.CANNOT_START_CALL);
      return;
    }
    //2 states need to manges - while ringing  and while connected
    socket.emit("call.handup", { callId: callId });
    dispath(callHangup({ callId }));

    stopLocalTracks();
    const pc = peerConnectionRef.current;
    if (pc) {
      pc.close();
      peerConnectionRef.current = null;
    }
  };

  return createPortal(
    <>
      <div className="bg-grey-dark-bg absolute inset-0 overflow-clip">
        {/* draggable contaienr */}
        <div className="mx-auto mt-5 h-11/12 w-[95vw] border">
          {callState !== "notInitiated" && (
            <PeerVideoPreview remoteStream={remoteStream} peerId={peerId} />
          )}
          <UserVideoPreview />
        </div>
        <button className="absolute top-0 left-0 bg-amber-200" onClick={() => toggleOtherPerson()}>
          Toggle peer
        </button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white">
          <CallControls
            handupCall={handleHandupCall}
            startCall={hanedleStartCall}
            peerConectionRef={peerConnectionRef}
            localStreamRef={localStreamRef}
          />
        </div>
      </div>
    </>,
    document.getElementById("root")!,
  );
};

export default P2PVideoPage;
