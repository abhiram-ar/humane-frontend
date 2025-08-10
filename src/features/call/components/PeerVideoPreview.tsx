import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import React, { useEffect, useRef, useState } from "react";
import UserProfileTumbnail from "./UserProfileTumbnail";

type Props = {
  peerId: string;
  peerConnection: RTCPeerConnection | null;
};

const PeerVideoPreview: React.FC<Props> = ({ peerId, peerConnection }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoDeviceId = useAppSelector((state) => state.call.activeVideoDeviceId);

  // useEffect(() => {
  //   if (!peerVideoRef.current || !videoDeviceId) return;
  //   const setVideo = async () => {
  //     try {
  //       const streams = await window.navigator.mediaDevices.getUserMedia({
  //         video: { deviceId: { exact: videoDeviceId } },
  //         audio: false,
  //       });

  //       if (streams) {
  //         const mediaStream = new MediaStream(streams.getVideoTracks());
  //         if (peerVideoRef.current) {
  //           peerVideoRef.current.srcObject = mediaStream;
  //           peerVideoRef.current.play();
  //         }
  //       }
  //     } catch (error) {
  //       console.log("error loaing camera stream", error);
  //     }
  //   };
  //   setVideo();
  // }, [videoDeviceId, cameraOn]);

  useEffect(() => {
    setCameraOn(true);
    if (!peerConnection) return;
    peerConnection.ontrack = (event) => {
      const mediaStream = new MediaStream();
      console.log("track received:", event.track);
      if (peerVideoRef.current) {
        mediaStream.addTrack(event.track);
        peerVideoRef.current.srcObject = mediaStream;
        peerVideoRef.current.play();
      }
    };
  }, [peerConnection]);

  return (
    <div
      ref={videoContainerRef}
      className={`h-full w-full rounded-2xl transition-transform`}
      style={{
        userSelect: "none", // prevents text selection while dragging
      }}
    >
      {!cameraOn ? (
        <UserProfileTumbnail
          userId={peerId}
          className="h-full w-full bg-radial-[at_50%_75%] from-purple-800 from-5% to-zinc-900"
        />
      ) : (
        <video
          muted={true}
          className="aspect-auto h-full w-full object-contain"
          ref={peerVideoRef}
          style={{ transform: "scaleX(-1)" }} // raw stream is has no mirror flip, this flips the like a mirror
        ></video>
      )}
    </div>
  );
};

export default PeerVideoPreview;
