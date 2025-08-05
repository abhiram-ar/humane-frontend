import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import React, { TouchEventHandler, useEffect, useRef, useState } from "react";

const UserVideoPreview: React.FC = () => {
  const [pos, setPos] = useState({ x: window.innerWidth - 300, y: window.innerHeight - 200 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // relative change, not anchoring to mouse pos
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const videoDeviceId = useAppSelector((state) => state.call.activeVideoDeviceId);

  // start dragging (mouse + touch)
  const startDrag = (clientX: number, clientY: number) => {
    setDragging(true);
    setOffset({ x: clientX - pos.x, y: clientY - pos.y });
  };

  const onMouseDown = (e: { preventDefault: () => void; clientX: number; clientY: number }) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const onMove = (mouseX: number, mouseY: number) => {
    if (!videoContainerRef.current) return;
    const padding = {
      x: videoContainerRef.current.clientWidth,
      y: videoContainerRef.current.clientHeight,
    };
    const XLimit = window.innerWidth - padding.x;
    const YLimit = window.innerHeight - padding.y;

    if (dragging) {
      const newComputedX = mouseX - offset.x;
      const newComputedY = mouseY - offset.y;
      if (mouseX > padding.x && mouseX < XLimit && mouseY > padding.y && mouseY < YLimit) {
        setPos({ x: newComputedX, y: newComputedY });
        return;
      }
      if (
        (mouseX < padding.x && mouseY > padding.y && mouseY < YLimit) ||
        (mouseX > XLimit && mouseY > padding.y && mouseY < YLimit)
      ) {
        setPos((oldPos) => ({ x: oldPos.x, y: newComputedY }));
        return;
      }

      if (
        (mouseY < padding.y && mouseX > padding.x && mouseX < XLimit) ||
        (mouseY > YLimit && mouseX > padding.x && mouseX < XLimit)
      ) {
        setPos((oldPos) => ({ x: newComputedX, y: oldPos.y }));
        return;
      }
    }
  };

  const onMouseMove = (e: { clientX: number; clientY: number }) => onMove(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    onMove(touch.clientX, touch.clientY);
  };

  const stopDrag = () => setDragging(false);

  // Attach global listeners only while dragging
  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", stopDrag);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopDrag);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopDrag);
    };
  }, [dragging, offset]);

  useEffect(() => {
    if (!userVideoRef.current || !videoDeviceId) return;
    const setVideo = async () => {
      try {
        const streams = await window.navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: videoDeviceId } },
          audio: false,
        });

        console.log("streams", streams);
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
  }, [videoDeviceId]);

  return (
    <div
      ref={videoContainerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="h-max-30 w-max-70 h-30 w-60 overflow-clip rounded-2xl border bg-zinc-400/50 transition-transform"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        scale: dragging ? 1.1 : 1,
        cursor: "grab",
        userSelect: "none", // prevents text selection while dragging
      }}
    >
      <video muted={true} className="aspect-auto h-full w-full" ref={userVideoRef}></video>
    </div>
  );
};

export default UserVideoPreview;
