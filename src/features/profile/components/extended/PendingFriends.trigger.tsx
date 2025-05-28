import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import PendingRecivedFriendRequest from "./PendingFriendRequestList";
import PendingSendRequest from "./PendingSendRequestList";

type Props = {
  userId: string;
};

const PendingFriendRequests: React.FC<Props> = ({ userId }) => {
  const [section, setSection] = useState<"recived" | "send">("recived");
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <p className="decoration-pop-green cursor-pointer underline-offset-3 hover:underline">
            <span className={`text-pop-green`}>{10}</span> Pending request
          </p>
        </DialogTrigger>
        <DialogContent className="border-grey-dark-bg bg-[#272727]" aria-describedby="edit profile">
          <DialogHeader>
            <DialogTitle className="text-almost-white">Friend requests</DialogTitle>
          </DialogHeader>
          <div className="flex justify-around gap-2 border-b border-zinc-400/50 text-white">
            <button
              onClick={() => section !== "recived" && setSection("recived")}
              className={`hover:bg-green-subtle w-full cursor-pointer rounded-t-lg py-2 text-center font-semibold transition-colors duration-300 ease-out hover:text-black ${section === "recived" && "bg-zinc-200 text-black"} `}
            >
              Recived
            </button>
            <button
              onClick={() => section !== "send" && setSection("send")}
              className={`hover:bg-green-subtle w-full cursor-pointer rounded-t-lg py-2 text-center font-semibold transition-colors duration-300 ease-out hover:text-black ${section === "send" && "bg-zinc-200 text-black"} `}
            >
              Send
            </button>
          </div>
          {section === "recived" ? (
            <PendingRecivedFriendRequest userId={userId} />
          ) : (
            <PendingSendRequest userId={userId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingFriendRequests;
