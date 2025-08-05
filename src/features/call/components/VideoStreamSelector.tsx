import Spinner from "@/components/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { setActiveVideoDeviceId } from "../redux/callSlice";

export function VideoStreamSelector() {
  const [activeInputDeviceId, setActiveVideoInputDeviceId] = React.useState("");
  const [videoDevicesInfo, setVideoDevicesInfo] = useState<MediaDeviceInfo[]>([]);
  const dispatch = useAppDispatch();

  const [deviceFetchingState, setDeviceFetchingState] = useState<
    "idle" | "loading" | "fetched" | "error"
  >("idle");

  useEffect(() => {
    const getVideoStreams = async () => {
      try {
        setDeviceFetchingState("loading");
        const devices = await window.navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");

        setVideoDevicesInfo(videoDevices);
        setDeviceFetchingState("fetched");

        return videoDevices;
      } catch (error) {
        setDeviceFetchingState("error");
        console.log(error);
      }
    };

    // inital page load
    setTimeout(async () => {
      await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoDevices = await getVideoStreams();
      if (videoDevices && videoDevices?.length > 0) {
        // for initial load, set the default app's audio input as OS's default auidio input stream
        // which is at index 0 as per the MDN docs
        setActiveVideoInputDeviceId(videoDevices[0].deviceId);
      }
    }, 500);

    // when new media devies become online
    let refreshTimer: ReturnType<typeof setTimeout>;
    window.navigator.mediaDevices.ondevicechange = async () => {
      await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // we might have multiple device changes events comming at a instant
      // so debouncing this
      setDeviceFetchingState("loading");
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(getVideoStreams, 200);
    };

    return () => {
      setDeviceFetchingState("idle");
    };
  }, []);

  useEffect(() => {
    if (!activeInputDeviceId) return;
    dispatch(setActiveVideoDeviceId(activeInputDeviceId));
  }, [activeInputDeviceId, dispatch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="my-auto border-none ps-3 pe-1 text-zinc-800 focus:ring-0 focus:outline-none">
          <ChevronUp size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-grey-light mb-4 border border-zinc-400/50 text-white">
        <DropdownMenuLabel>Video Input devices</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-400/50" />

        {deviceFetchingState === "loading" && (
          <div>
            <Spinner className="mt-3 flex h-8 w-full justify-center" />
          </div>
        )}

        {deviceFetchingState === "fetched" && (
          <DropdownMenuRadioGroup
            value={activeInputDeviceId}
            onValueChange={setActiveVideoInputDeviceId}
          >
            {videoDevicesInfo.map((audioStream) => (
              <DropdownMenuRadioItem
                key={audioStream.deviceId}
                value={audioStream.deviceId}
                className="hover:bg-zinc-500"
              >
                {audioStream.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
