import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import React, { useEffect, useRef } from "react";
import UserProfileTumbnail from "./UserProfileTumbnail";

type Props = {
  peerId: string;
};

const PeerVideoPreview: React.FC<Props> = ({ peerId }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const cameraOn = useAppSelector((state) => state.call.cameraOn);
  const videoDeviceId = useAppSelector((state) => state.call.activeVideoDeviceId);

  useEffect(() => {
    if (!userVideoRef.current || !videoDeviceId) return;
    const setVideo = async () => {
      try {
        const streams = await window.navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: videoDeviceId } },
          audio: false,
        });

        if (streams) {
          const mediaStream = new MediaStream(streams.getVideoTracks());
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = mediaStream;
            userVideoRef.current.play();
          }
        }
      } catch (error) {
        console.log("error loaing camera stream", error);
      }
    };
    setVideo();
  }, [videoDeviceId, cameraOn]);

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
          ref={userVideoRef}
          style={{ transform: "scaleX(-1)" }} // raw stream is has no mirror flip, this flips the like a mirror
        ></video>
      )}
    </div>
  );
};

export default PeerVideoPreview;
