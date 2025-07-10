import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { TypedChatSocket } from "./Types/SocketIOConfig.types";

type ChatSocketContextType = {
  socket: TypedChatSocket | null;
};

const ChatSocketContext = createContext<ChatSocketContextType>({
  socket: null,
});

const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.userAuth.token);
  const chatSocketRef = useRef<TypedChatSocket>(null);

  useEffect(() => {
    if (!token) return;

    const socket: TypedChatSocket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
      path: "/api/v1/chat/socket.io",
      // auth: { token }, // prod
      query: { token }, // dev
    });
    chatSocketRef.current = socket;

    socket.on("test", (msg: unknown) => {
      console.log("chat-test-msg", msg);
    });

    return () => {
      socket.disconnect();
      chatSocketRef.current = null;
    };
  }, [token]);

  return (
    <ChatSocketContext.Provider value={{ socket: chatSocketRef.current }}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export default ChatSocketProvider;

export function useChatSocketProvider() {
  return useContext(ChatSocketContext);
}
