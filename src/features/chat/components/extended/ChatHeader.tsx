import HumaneScoreNumberFlow from "@/components/HumaneScoreNumberFlow";
import ProfilePicSmall from "@/components/ProfilePicSmall";
import { Phone, Video } from "lucide-react";
import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex w-full items-center justify-between border-b border-zinc-400/50 px-5 py-3">
      <div className="flex items-center gap-2">
        <ProfilePicSmall />
        <div>
          <p className="text-almost-white">{"User name"}</p>
          <HumaneScoreNumberFlow score={100} />
        </div>
      </div>
      <div className="text-almost-white flex items-center gap-3 overflow-hidden rounded-xl border-zinc-400/50 px-3">
        <div className="hover:bg-green-subtle/90 rounded-full p-2 hover:text-black">
          <Phone size={20} />
        </div>
        <div className="hover:bg-green-subtle/90 rounded-full p-2 hover:text-black">
          <Video />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
