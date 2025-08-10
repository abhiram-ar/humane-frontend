import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { TypedChatSocket } from "./Types/SocketIOConfig.types";
import {
  addMessageToChat,
  addToConversationList,
  deleteOneToOneMessage,
  recentConvoIdxHashMap,
  setOneToOneChatTypingIndicator,
} from "@/features/chat/redux/chatSlice";
import { getUserConvoById } from "@/features/chat/services/getUserConvoById";
import { ConversationWithLastMessage } from "@/features/chat/Types/ConversationWithLastMessage";
import useFindOtherUserOfOnetoOneConvo from "@/features/chat/hooks/useFindOtherUserOfOnetoOneConvo";
import {
  callConnected,
  callDeclinedByPeer,
  callHangup,
  inComingCall,
  incomingCallRejected,
} from "@/features/call/redux/callSlice";

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
  const find = useFindOtherUserOfOnetoOneConvo();

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

    socket.on("new-one-to-one-message", (msg, participants) => {
      const otherUser = find(participants);
      dispath(addMessageToChat({ message: msg, otherUserId: otherUser.userId }));
      if (typeof recentConvoIdxHashMap[msg.conversationId] !== "number") {
        getUserConvoById(msg.conversationId)
          .then((data) => {
            if (data.convo) {
              const convo: ConversationWithLastMessage = {
                ...data.convo,
                unreadCount: 1,
                lastMessage: msg,
              };
              dispath(addToConversationList([convo]));
            }
          })
          .catch((error) => console.log("error file getting new conno for first message", error));
      }
    });

    socket.on("one-to-one-message-deleted", (event) => {
      const otherUser = find(event.participants);
      dispath(
        deleteOneToOneMessage({
          otherUserId: otherUser.userId,
          deletedMessage: event.message,
        }),
      );
    });

    socket.on("typing-one-to-one-message", (event) => {
      dispath(
        setOneToOneChatTypingIndicator({
          otherUserId: event.typingUser,
          convoId: event.convoId,
          time: event.time,
        }),
      );
    });
    socket.on("call.incoming", (event) => {
      dispath(inComingCall(event));
    });

    socket.on("call.acted.by_other_device", (event) => {
      console.log("other", event);
      dispath(incomingCallRejected({ callId: event.callId }));
    });

    socket.on("call.declined", (event) => dispath(callDeclinedByPeer({ callId: event.callId })));

    socket.on("call.incoming.cancelled", (event) =>
      dispath(incomingCallRejected({ callId: event.callId })),
    );

    socket.on("call.connected", (event) =>
      setTimeout(() => dispath(callConnected({ callId: event.callId })), 2 * 1000),
    );

    socket.on("call.ended", (event) => dispath(callHangup({ callId: event.callId })));

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
