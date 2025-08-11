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
import { useEffect } from "react";
import { setActiveVideoDeviceId } from "../redux/callSlice";
import { useMediaDeviceSelector } from "../hooks/useMediaDeviceSelector";

export function VideoStreamSelector() {
  const dispatch = useAppDispatch();
  const {
    activeDeviceId: activeInputDeviceId,
    setActiveDeviceId: setActiveVideoInputDeviceId,
    devices: videoDevicesInfo,
    state: deviceFetchingState,
  } = useMediaDeviceSelector("videoinput");

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
