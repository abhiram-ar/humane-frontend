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

    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !callId) return;
      socket?.emit("call.ice-candidates", { callId, ice: JSON.stringify(ev.candidate) });
    };

    pc.onnegotiationneeded = async () => {
      try {
        if (!callId) return;
        // if signalingState isn't stable, negotiation shouldn't run
        if (makingOffer.current || pc.signalingState !== "stable") return;
        makingOffer.current = true;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.emit("call.sdp.offer", { callId, offerSDP: JSON.stringify(pc.localDescription) });
      } catch (err) {
        console.error("errror while negotiating", err);
      } finally {
        makingOffer.current = false;
      }
    };

    pc.ontrack = (event) => {
      // prefer full stream (most browsers set streams[0])
      const s =
        event.streams && event.streams[0] ? event.streams[0] : new MediaStream([event.track]);
      setRemoteStream(s);
      event.track.onended = () => {
        // if no tracks left, clear
        if (!s.getVideoTracks().length && !s.getAudioTracks().length) setRemoteStream(null);
      };
    };

    pc.onconnectionstatechange = () => {
      console.log("pc state", pc.connectionState);
      if (pc.connectionState === "failed") {
        // try restart? or emit hangup
      }
    };

    return pc;
  }, [callId, socket]);

  const flushQueuedCandidates = useCallback(async (pc: RTCPeerConnection) => {
    if (!queuedCandidatesRef.current.length) return;
    for (const c of queuedCandidatesRef.current.splice(0)) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch (err) {
        console.warn("failed adding queued candidate", err);
      }
    }
  }, []);

  // common socket listeners for caller and callee
  useEffect(() => {
    if (!socket) return;

    const onOffer = async (event: { offerSDP: string; callId: string }) => {
      const pc = createOrGetPC();
      const offer = JSON.parse(event.offerSDP);
      const offerCollision = makingOffer.current || pc.signalingState !== "stable";
      if (offerCollision && !polite) {
        console.warn("impolite: ignoring offer collision");
        return;
      }
      isSettingRemoteDescritionPending.current = true;
      try {
        await pc.setRemoteDescription(offer);
        await flushQueuedCandidates(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("call.sdp.answer", {
          callId: event.callId,
          answerSDP: JSON.stringify(pc.localDescription),
        });
      } finally {
        isSettingRemoteDescritionPending.current = false;
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
        const candidateInit = JSON.parse(event.ice) as RTCIceCandidate;
        const pc = peerConnectionRef.current;
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
        } else {
          queuedCandidatesRef.current.push(candidateInit);
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
    async (opts: {
      video: boolean;
      audio: boolean;
      audioDeviceId?: string;
      videoDeviceId?: string;
    }) => {
      try {
        if (!opts.audio && !opts.video) throw new Error("No media requested");

        const constraints: MediaStreamConstraints = {
          audio: opts.audio
            ? opts.audioDeviceId
              ? { deviceId: { exact: opts.audioDeviceId } }
              : true
            : false,
          video: opts.video
            ? opts.videoDeviceId
              ? { deviceId: { exact: opts.videoDeviceId } }
              : true
            : false,
        };

        const s = await navigator.mediaDevices.getUserMedia(constraints);
        stopLocalTracks();
        localStreamRef.current = s;

        const pc = createOrGetPC();

        // for each local track: try to replace existing sender track. otherwise add trak
        for (const t of s.getTracks()) {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === t.kind);
          if (sender) {
            await sender.replaceTrack(t);
          } else {
            pc.addTrack(t, s);
          }
        }
      } catch (err) {
        console.error("startLocalMedia failed", err);
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
        videoDeviceId: activeVideoDeviceId,
        audioDeviceId: activeAudioDeviceId,
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
        audioDeviceId: activeAudioDeviceId,
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
