import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import OneToOneMessagesContainer from "../components/extended/OneToOneMessagesContainer";
import SendMessageBar from "../components/extended/SendMessageBar";
import { CreateMessageFields } from "../Types/CreateMessageFields";
import { SendOneToOneMessageInputDTO } from "@/app/providers/Types/CreateOneToOneMessage.dto";
import { useParams } from "react-router";
import ErrorPage from "@/layout/PageNotFoundPage";
import { getPostMediaPresignedURL } from "@/features/home/services/GetPostMediaPresingedURL";
import axios from "axios";
import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import {
  addMessageToChat,
  markOneToOneConvoAsRead,
  replaceOneToOneMessage,
  setActiveConvo,
  updateLastMessageOfConvo,
} from "../redux/chatSlice";
import { Message } from "../Types/Message";
import useUserId from "@/hooks/useUserId";
import { useEffect, useRef } from "react";
import OneToOneChatHeader from "../components/extended/OneToOneChatHeader";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { OneToOneConversation } from "../Types/Conversation";

type GetOneToOneConvoResponse = {
  data: { conversation: OneToOneConversation | null };
};

const OneToOneChatPage = () => {
  const { socket } = useChatSocketProvider();
  const { userId: otherUserId } = useParams();
  const dispath = useAppDispatch();
  const authenticatedUserId = useUserId();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { data: convo } = useQuery({
    queryKey: ["one-to-one-convo", otherUserId],
    queryFn: async () => {
      const res = await api.get<GetOneToOneConvoResponse>(
        `${API_ROUTES.CHAT_ROUTE}/convo/one-to-one/`,
        {
          params: { otherUserId },
        },
      );
      return res.data.data.conversation;
    },
    enabled: !!otherUserId,
    staleTime: Infinity,
  });

  // set currsent convo as active convo
  useEffect(() => {
    if (!convo) return;
    dispath(setActiveConvo({ converId: convo.id }));
  }, [convo, dispath, otherUserId]);

  // marking current convo as read
  useEffect(() => {
    if (!socket || !convo) return;

    if (convo) {
      socket.emit("convo-opened", { convoId: convo.id, time: new Date() });
      dispath(markOneToOneConvoAsRead({ convoId: convo.id }));
    }

    return () => {
      socket.emit("convo-opened", { convoId: convo.id, time: new Date() });
    };
  }, [convo, dispath, otherUserId, socket]);

  if (!otherUserId || !authenticatedUserId) return ErrorPage({ message: "User not found" });

  const handleOnSubmit = async (data: CreateMessageFields) => {
    if (socket) {
      let attachment: SendOneToOneMessageInputDTO["attachment"];

      const typedAttachement = data.attachment as FileList | undefined;
      let tempURL: string | undefined;

      if (typedAttachement && typedAttachement.length > 0) {
        const file = typedAttachement[0];

        const result = await getPostMediaPresignedURL(file);
        await axios.put(result.preSignedURL, file);
        attachment = { attachmentKey: result.key, attachmentType: file.type };

        tempURL = URL.createObjectURL(file);
      }

      const messageData: SendOneToOneMessageInputDTO = {
        message: data.message,
        to: otherUserId,
        attachment,
      };

      const tempAttachment: Message["attachment"] = messageData.attachment
        ? { attachmentType: messageData.attachment.attachmentType, attachmentURL: tempURL }
        : undefined;

      const tempMessage: Message = {
        id: `temp-${Date.now}-${Math.random() * 100}`,
        senderId: authenticatedUserId,
        conversationId: convo?.id ?? "unknown",
        message: messageData.message,
        sendAt: new Date().toISOString(),
        deletededFor: [],
        attachment: tempAttachment,
        replyToMessageId: undefined,
        sendStatus: "pending",
      };

      dispath(addMessageToChat({ otherUserId: messageData.to, message: tempMessage }));
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight });
        }
      }, 100);

      socket.emit("send-one-to-one-message", messageData, (ack) => {
        if (ack.success && ack.message) {
          dispath(
            replaceOneToOneMessage({
              otherUserId: messageData.to,
              newMessage: ack.message,
              messageId: tempMessage.id,
            }),
          );
          dispath(
            updateLastMessageOfConvo({ convoId: ack.message.conversationId, message: ack.message }),
          );
          if (tempURL) URL.revokeObjectURL(tempURL);
        } else {
          dispath(
            replaceOneToOneMessage({
              otherUserId: messageData.to,
              messageId: tempMessage.id,
              newMessage: { ...tempMessage, sendStatus: "error" },
            }),
          );
        }
      });
    }
  };

  console.log("render page");

  const handleOnMessageUpdate = () => {
    if (!socket || !convo) return;
    socket.emit("convo-opened", { convoId: convo.id, time: new Date() });
  };

  return (
    <div className="relative h-screen w-full overflow-y-hidden">
      <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 backdrop-blur-lg">
        <OneToOneChatHeader otherUserId={otherUserId} />
      </div>

      <OneToOneMessagesContainer
        otherUserId={otherUserId}
        containerRef={messageContainerRef}
        handleOnMessageUpdate={handleOnMessageUpdate}
      />
      <div className="absolute bottom-0 left-1/2 z-30 w-4/5 -translate-x-1/2">
        <SendMessageBar handleOnSubmit={handleOnSubmit} />
      </div>
    </div>
  );
};

export default OneToOneChatPage;
