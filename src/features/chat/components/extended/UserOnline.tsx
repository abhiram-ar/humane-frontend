import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import { Dot } from "lucide-react";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";

type Props = { userId?: string } & ComponentPropsWithoutRef<"div">;

const UserOnline: React.FC<Props> = ({ userId, ...props }) => {
  const [isUserOnline, setUserOnline] = useState(false);
  const { socket } = useChatSocketProvider();

  useEffect(() => {
    if (!socket || !userId) return;

    const handleUserOnlineCheck = () => {
      socket.emit("is-user-online", userId, (ack) => {
        if (ack) setUserOnline(true);
        else setUserOnline(false);
      });
    };
    // intial-check
    const initialTimer = setTimeout(handleUserOnlineCheck, 500);

    const poolingTimer = setInterval(handleUserOnlineCheck, 5 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(poolingTimer);
      setUserOnline(false);
    };
  }, [socket, userId]);

  return (
    <div {...props}>
      <div
        className={`text-pop-green flex stroke-5 opacity-0 transition-all duration-200 ${isUserOnline ? "opacity-100" : ""}`}
      >
        <Dot className="text-zinc-400" />
        <p className="relative">Online</p>
      </div>
    </div>
  );
};

export default UserOnline;
