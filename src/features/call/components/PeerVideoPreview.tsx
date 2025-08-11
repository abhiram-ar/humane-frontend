import React, { useEffect, useRef, useState } from "react";
import UserProfileTumbnail from "./UserProfileTumbnail";

type Props = {
  peerId: string;
  remoteStream: MediaStream | null;
};

const PeerVideoPreview: React.FC<Props> = ({ peerId, remoteStream }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    setCameraOn(!!remoteStream);
    if (peerVideoRef.current && remoteStream?.getVideoTracks().length) {
      peerVideoRef.current.srcObject = remoteStream
      peerVideoRef.current.play().catch((e) => console.error("error remote stream autoplay", e));
      console.log("setting strem", remoteStream);
    } else {
      setCameraOn(false);
    }
  }, [remoteStream]);

  return (
    <div
      ref={videoContainerRef}
      className="relative h-full w-full rounded-2xl transition-transform"
      style={{
        userSelect: "none", // prevents text selection while dragging
      }}
    >
      {!cameraOn && (
        <UserProfileTumbnail
          userId={peerId}
          className="absolute h-full w-full bg-radial-[at_50%_75%] from-purple-800 from-5% to-zinc-900"
        />
      )}
      <video
        muted={true}
        className="aspect-auto h-full w-full object-contain"
        ref={peerVideoRef}
        style={{ transform: "scaleX(-1)" }} // raw stream is has no mirror flip, this flips the like a mirror
      ></video>
    </div>
  );
};

export default PeerVideoPreview;
