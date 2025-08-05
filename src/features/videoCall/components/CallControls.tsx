import { Mic, Phone, Video } from "lucide-react";

const CallControls = () => {
  return (
    <div className="item-center flex justify-center gap-2 border border-zinc-400/50 bg-zinc-700 px-3 py-2 rounded-4xl">
      {/* timeer */}
      <div className="rounded-full bg-zinc-500/80 p-3 hover:bg-zinc-500">
        <Mic />
      </div>
      <div className="rounded-full bg-zinc-500/80 p-3 hover:bg-zinc-500">
        <Video />
      </div>
      <div className="rounded-full bg-red-500/80 p-3 hover:bg-red-500 ms-10">
        <div className="rotate-135 px-3">
          <Phone />
        </div>
      </div>
    </div>
  );
};

export default CallControls;
