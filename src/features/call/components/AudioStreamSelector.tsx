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
import { useMediaDeviceSelector } from "../hooks/useMediaDeviceSelector";
import { useEffect } from "react";
import { setActiveAudioDeviceId } from "../redux/callSlice";
import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";

export function AudioStreamSelector() {
  const dispatch = useAppDispatch();

  const { activeDeviceId, setActiveDeviceId, devices, state } =
    useMediaDeviceSelector("audioinput");

  useEffect(() => {
    if (!activeDeviceId) return;
    dispatch(setActiveAudioDeviceId(activeDeviceId));
  }, [activeDeviceId, dispatch]);
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

        {state === "loading" && (
          <div>
            <Spinner className="mt-3 flex h-8 w-full justify-center" />
          </div>
        )}

        {state === "fetched" && (
          <DropdownMenuRadioGroup value={activeDeviceId} onValueChange={setActiveDeviceId}>
            {devices.map((audioStream) => (
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
