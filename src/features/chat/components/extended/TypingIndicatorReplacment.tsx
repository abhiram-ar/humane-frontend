import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";

type Props = {
  convoId?: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"p">;

const TypingIndicatorReplacement: React.FC<Props> = ({ convoId, children, ...props }) => {
  const [typing, setTyping] = useState(false);
  const typingRegisteredAt = useAppSelector((state) =>
    convoId ? state.chat.oneToOneChatTypingRegisteredAtMap[convoId] : undefined,
  );

  useEffect(() => {
    if (!typingRegisteredAt) return;
    let timer: ReturnType<typeof setTimeout>;

    const timeDelta = Date.now() - new Date(typingRegisteredAt).getTime();
    if (timeDelta < 3000) {
      setTyping(true);
      timer = setTimeout(() => setTyping(false), 3000);
    } else {
      setTyping(false);
    }

    return () => clearTimeout(timer);
  }, [typingRegisteredAt]);

  return <div>{typing ? <p {...props}>Typing.. </p> : children}</div>;
};

export default TypingIndicatorReplacement;
