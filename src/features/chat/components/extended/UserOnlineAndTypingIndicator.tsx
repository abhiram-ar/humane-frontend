import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import { Dot } from "lucide-react";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import useChatTyping from "../../hooks/useChatTyping";

type Props = { userId?: string; convoId?: string } & ComponentPropsWithoutRef<"div">;

const UserOnlineAndTypingIndicator: React.FC<Props> = ({ userId, convoId, ...props }) => {
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
      setTyping(false);
    };
  }, [socket, userId]);

  const { typing, setTyping } = useChatTyping(convoId);

  return (
    <div {...props}>
      <div
        className={`text-pop-green flex stroke-5 opacity-0 transition-all duration-200 ${isUserOnline ? "opacity-100" : ""}`}
      >
        <Dot className="text-zinc-400" />
        <p className="relative">{typing ? "Typing.." : "Online"}</p>
      </div>
    </div>
  );
};

export default UserOnlineAndTypingIndicator;
