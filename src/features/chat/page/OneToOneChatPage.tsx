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
import { addMessageToChat, replaceOneToOneMessage } from "../redux/chatSlice";
import { Message } from "../Types/Message";
import useUserId from "@/hooks/useUserId";
import { useRef } from "react";
import OneToOneChatHeader from "../components/extended/OneToOneChatHeader";

const OneToOneChatPage = () => {
  const { socket } = useChatSocketProvider();
  const { userId: otherUserId } = useParams();
  const dispath = useAppDispatch();
  const authenticatedUserId = useUserId();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  if (!otherUserId || !authenticatedUserId) return ErrorPage({ message: "User not found" });

  console.log(otherUserId);

  const handleOnSubmit = async (data: CreateMessageFields) => {
    if (socket) {
      console.log(data);
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
        conversationId: "unknown",
        message: messageData.message,
        sendAt: new Date().toISOString(),
        deletededFor: [],
        attachment: tempAttachment,
        replyToMessageId: undefined,
        sendStatus: "pending",
      };

      dispath(addMessageToChat({ otherUserId: messageData.to, message: tempMessage }));
      console.log("scrolled", messageContainerRef);
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight });
        }
      }, 100);

      socket.emit("send-one-to-one-message", messageData, (ack) => {
        console.log("message recived", ack);
        if (ack.success && ack.message) {
          dispath(
            replaceOneToOneMessage({
              otherUserId: messageData.to,
              newMessage: ack.message,
              messageId: tempMessage.id,
            }),
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

  return (
    <div className="relative h-screen w-full overflow-y-hidden">
      <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 backdrop-blur-lg">
        <OneToOneChatHeader otherUserId={otherUserId} />
      </div>

      <OneToOneMessagesContainer otherUserId={otherUserId} containerRef={messageContainerRef} />
      <div className="absolute bottom-0 left-1/2 z-30 w-4/5 -translate-x-1/2">
        <SendMessageBar handleOnSubmit={handleOnSubmit} />
      </div>
    </div>
  );
};

export default OneToOneChatPage;
