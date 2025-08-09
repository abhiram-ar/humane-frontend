import { Mic, MicOff, Phone, PhoneCall, PhoneMissed, Video, VideoOff } from "lucide-react";
import { AudioStreamSelector } from "./AudioStreamSelector";
import { VideoStreamSelector } from "./VideoStreamSelector";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { cameraOn, micOn } from "../redux/callSlice";

type Props = {
  startCall: () => void;
};

const CallControls: React.FC<Props> = ({ startCall }) => {
  const micStatus = useAppSelector((state) => state.call.micOn);
  const cameraStatus = useAppSelector((state) => state.call.cameraOn);
  const callStatus = useAppSelector((state) => state.call.callStatus);
  const dispath = useAppDispatch();

  return (
    <div className="item-center flex justify-center gap-2 rounded-4xl border border-zinc-400/50 bg-zinc-700 px-3 py-2 transition-all duration-200">
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

      <div className="flex max-h-40 w-40 max-w-40 justify-end">
        {callStatus === "joined" && (
          <div className="cursor-pointer rounded-full bg-red-500/80 p-3 hover:bg-red-500">
            <div className="rotate-135 px-3">
              <Phone />
            </div>
          </div>
        )}

        {callStatus === "notInitiated" && (
          <div
            onClick={startCall}
            className="bg-pop-green/80 hover:bg-pop-green ms-10 cursor-pointer rounded-full p-3"
          >
            <div className="flex gap-1 px-0.5 text-black">
              <Phone />
              <p>Start call</p>
            </div>
          </div>
        )}

        {callStatus === "pending" ||
          (callStatus === "ringing" && (
            <div className="cursor-pointer rounded-full bg-blue-400/90 p-3 hover:bg-blue-400">
              <div className="px-3 text-black">
                <PhoneCall className="animate-pulse" />
              </div>
            </div>
          ))}

        {callStatus === "rejected" && (
          <div className="cursor-pointer rounded-full bg-orange-400/80 p-3 hover:bg-orange-400">
            <div className="flex gap-2 px-3 text-black">
              <PhoneMissed />
              <p>Not taken</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallControls;
