import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { Dot } from "lucide-react";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";

type Props = { userId?: string } & ComponentPropsWithoutRef<"div">;

const UserOnlineAndTypingIndicator: React.FC<Props> = ({ userId, ...props }) => {
  const [isUserOnline, setUserOnline] = useState(false);
  const { socket } = useChatSocketProvider();
  const [typing, setTyping] = useState(false);
  const typingRegisteredAt = useAppSelector((state) =>
    userId ? state.chat.oneToOneChatTypingRegisteredAtMap[userId] : undefined,
  );

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

  useEffect(() => {
    if (!typingRegisteredAt) return;
    let timer: ReturnType<typeof setTimeout>;

    if (Date.now() - new Date(typingRegisteredAt).getTime() < 3000) {
      setTyping(true);
      timer = setTimeout(() => setTyping(false), 3000);
    } else {
      setTyping(false);
    }

    return () => clearTimeout(timer);
  }, [typingRegisteredAt]);

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
