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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ServerAPIResponse } from "@/types/ServerAPIResponse";

type Props = {
  userId: string;
};

type FriendReqCountResponseData = { count: number };

const PendingFriendRequests: React.FC<Props> = ({ userId }) => {
  const { data: friendReq } = useQuery({
    queryKey: ["friend-req-recived", "count"],
    queryFn: async () => {
      const res = await api.get<ServerAPIResponse<FriendReqCountResponseData>>(
        "/api/v1/user/social/friend-req/count",
      );
      return res.data.data;
    },
  });

  const [section, setSection] = useState<"recived" | "send">("recived");
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <p className="decoration-pop-green cursor-pointer underline-offset-3 hover:underline">
            <span className={`text-pop-green`}>{friendReq?.count || ""}</span> Pending request
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
