import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { TypedChatSocket } from "./Types/SocketIOConfig.types";
import { addMessageToChat } from "@/features/chat/redux/chatSlice";

type ChatSocketContextType = {
  socket: TypedChatSocket | null;
};

export const ChatSocketContext = createContext<ChatSocketContextType>({
  socket: null,
});

const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.userAuth.token);
  const [chatSocket, setChatSocket] = useState<TypedChatSocket | null>(null);
  const dispath = useAppDispatch();

  useEffect(() => {
    if (!token) return;

    const socket: TypedChatSocket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
      path: "/api/v1/chat/socket.io",
      // auth: { token }, // prod
      query: { token }, // dev
    });
    setChatSocket(socket);

    socket.on("test", (msg: unknown) => {
      console.log("chat-test-msg", msg);
    });

    socket.on("new-one-to-one-message", (msg) => {
      dispath(addMessageToChat({ message: msg, otherUserId: msg.senderId }));
    });

    return () => {
      socket.disconnect();
      setChatSocket(null);
    };
  }, [token]);

  return (
    <ChatSocketContext.Provider value={{ socket: chatSocket }}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export default ChatSocketProvider;

export function useChatSocketProvider() {
  return useContext(ChatSocketContext);
}
