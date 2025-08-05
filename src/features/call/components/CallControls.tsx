import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { AudioStreamSelector } from "./AudioStreamSelector";
import { VideoStreamSelector } from "./VideoStreamSelector";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { cameraOn, micOn } from "../redux/callSlice";

const CallControls = () => {
  const micStatus = useAppSelector((state) => state.call.micOn);
  const cameraStatus = useAppSelector((state) => state.call.cameraOn);
  const dispath = useAppDispatch();

  return (
    <div className="item-center flex justify-center gap-2 rounded-4xl border border-zinc-400/50 bg-zinc-700 px-3 py-2">
      {/* timeer */}
      <div className="flex rounded-full bg-zinc-600">
        <AudioStreamSelector />
        <div
          onClick={() => dispath(micOn(!micStatus))}
          className={`rounded-full p-3 ${micStatus ? "bg-zinc-500/80 hover:bg-zinc-500" : "bg-red-500/50 hover:bg-red-500/70"}`}
        >
          {micStatus ? <Mic /> : <MicOff />}
        </div>
      </div>

      <div className="flex rounded-full bg-zinc-600">
        <VideoStreamSelector />
        <div
          onClick={() => dispath(cameraOn(!cameraStatus))}
          className={`rounded-full p-3 ${cameraStatus ? "bg-zinc-500/80 hover:bg-zinc-500" : "bg-red-500/50 hover:bg-red-500/70"}`}
        >
          {cameraStatus ? <Video /> : <VideoOff />}
        </div>
      </div>
      <div className="ms-10 rounded-full bg-red-500/80 p-3 hover:bg-red-500">
        <div className="rotate-135 px-3">
          <Phone />
        </div>
      </div>
    </div>
  );
};

export default CallControls;
