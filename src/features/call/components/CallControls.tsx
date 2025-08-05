import { Mic, Phone, Video } from "lucide-react";
import { AudioStreamSelector } from "./AudioStreamSelector";
import { VideoStreamSelector } from "./VideoStreamSelector";

const CallControls = () => {
  return (
    <div className="item-center flex justify-center gap-2 rounded-4xl border border-zinc-400/50 bg-zinc-700 px-3 py-2">
      {/* timeer */}
      <div className="flex rounded-full bg-zinc-600">
        <AudioStreamSelector />
        <div className="rounded-full bg-zinc-500/80 p-3 hover:bg-zinc-500">
          <Mic />
        </div>
      </div>

      <div className="flex rounded-full bg-zinc-600">
        <VideoStreamSelector />
        <div className="rounded-full bg-zinc-500/80 p-3 hover:bg-zinc-500">
          <Video />
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
