import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { useEffect, useState } from "react";

const useChatTyping = (convoId?: string) => {
  const [typing, setTyping] = useState(false);
  const typingRegisteredAt = useAppSelector((state) =>
    convoId ? state.chat.oneToOneChatTypingRegisteredAtMap[convoId] : undefined,
  );

  useEffect(() => {
    if (!typingRegisteredAt) return;
    let timer: ReturnType<typeof setTimeout>;

    const timeDelta = Date.now() - new Date(typingRegisteredAt).getTime();
    if (timeDelta < 2000) {
      setTyping(true);
      timer = setTimeout(
        () => setTyping(false),
        2000 - (Date.now() - new Date(typingRegisteredAt).getTime()),
      );
    } else {
      setTyping(false);
    }

    return () => {
      clearTimeout(timer);
      setTyping(false);
    };
  }, [typingRegisteredAt]);

  return { typing, setTyping };
};

export default useChatTyping;
