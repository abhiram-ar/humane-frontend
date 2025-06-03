import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../Types/SocketIOConfig.types";
import FriendReqNoti from "../Components/FriendReqNoti";
import { FriendReqNotification } from "../Types/FriendReqNoti";

const NotificationPage = () => {
  const token = useAppSelector((state) => state.userAuth.token);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost", {
      path: "/api/v1/notification/socket.io",
      auth: { token },
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log(err);
    });

    socket.on("test", (msg) => {
      console.log(msg);
    });

    socket.on("push-noti", (noti) => {
      console.log(noti);
    });

    socket.on("remove-noti", (noti) => {
      console.log(noti);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const tempNotis: FriendReqNotification[] = Array(20)
    .fill(0)
    .map(() => ({
      type: "friend-req",
      id: "",
      isRead: Math.random() > 0.5 ? true : false,
      updatedAt: "",
      friendshipId: "",
      reciverId: "",
      requesterId: "",
      createdAt: "",
      status: Math.random() > 0.5 ? "ACCEPTED" : "PENDING",
    }));
  console.log(Math.random());
  return (
    <div className="min-h-full w-120 border-x border-zinc-400/50">
      <h2 className="text-offwhite border-b border-zinc-400/50 px-5 py-10 text-xl font-semibold">
        Notifications
      </h2>

      <div>
        {tempNotis.map((noti, i) => (
          <FriendReqNoti key={i} noti={noti} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
