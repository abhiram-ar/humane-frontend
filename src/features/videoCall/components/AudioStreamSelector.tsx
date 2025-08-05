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
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

export function AudioStreamSelector() {
  const [activeAudioInputDeviceId, setActiveAdudioInputDeviceId] = React.useState("");
  const [audioDevicesInfo, setAudioDevicesInfo] = useState<MediaDeviceInfo[]>([]);

  const [deviceFetchingState, setDeviceFetchingState] = useState<
    "idle" | "loading" | "fetched" | "error"
  >("idle");

  useEffect(() => {
    const getAudioStreams = async () => {
      try {
        setDeviceFetchingState("loading");
        const devices = await window.navigator.mediaDevices.enumerateDevices();
        console.log("devices found", devices);
        const audioDevics = devices.filter((device) => device.kind === "audioinput");
        setAudioDevicesInfo(audioDevics);

        setDeviceFetchingState("fetched");

        return audioDevics;
      } catch (error) {
        setDeviceFetchingState("error");
        console.log(error);
      }
    };

    setTimeout(async () => {
      await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const audioDevices = await getAudioStreams();
      if (audioDevices && audioDevices?.length > 0) {
        // for initial load, set the default app's audio input as OS's default auidio input stream
        // which is at index 0 as per the MDN docs
        setActiveAdudioInputDeviceId(audioDevices[0].deviceId);
      }
    }, 500);

    let refreshTimer: ReturnType<typeof setTimeout>;
    window.navigator.mediaDevices.ondevicechange = async () => {
      await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // we might have multiple device changes events comming at a instant
      // so debouncing this
      setDeviceFetchingState("loading");
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(getAudioStreams, 200);
    };

    return () => {
      setDeviceFetchingState("idle");
    };
  }, []);

  console.log(audioDevicesInfo);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="my-auto border-none ps-3 pe-1 text-zinc-800 focus:ring-0 focus:outline-none">
          <ChevronUp size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-grey-light mb-4 border border-zinc-400/50 text-white">
        <DropdownMenuLabel>Audio Input Devices</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-400/50" />

        {deviceFetchingState === "loading" && (
          <div>
            <Spinner className="mt-3 flex h-8 w-full justify-center" />
          </div>
        )}

        {deviceFetchingState === "fetched" && (
          <DropdownMenuRadioGroup
            value={activeAudioInputDeviceId}
            onValueChange={setActiveAdudioInputDeviceId}
          >
            {audioDevicesInfo.map((audioStream) => (
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
