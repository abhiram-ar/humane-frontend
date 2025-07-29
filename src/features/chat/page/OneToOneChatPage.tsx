import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import OneToOneMessagesContainer from "../components/extended/OneToOneMessagesContainer";
import SendMessageBar from "../components/extended/SendMessageBar";
import { CreateMessageFields } from "../Types/CreateMessageFields";
import { SendOneToOneMessageInputDTO } from "@/app/providers/Types/CreateOneToOneMessage.dto";
import { useLocation, useParams } from "react-router";
import ErrorPage from "@/layout/PageNotFoundPage";
import { getPostMediaPresignedURL } from "@/features/home/services/GetPostMediaPresingedURL";
import axios from "axios";
import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import {
  addMessageToChat,
  addToConversationList,
  deleteOneToOneMessage,
  markOneToOneConvoAsRead,
  recentConvoIdxHashMap,
  replaceOneToOneMessage,
  setActiveConvo,
  updateLastMessageOfConvo,
} from "../redux/chatSlice";
import { Message } from "../Types/Message";
import useUserId from "@/hooks/useUserId";
import { useEffect, useRef } from "react";
import OneToOneChatHeader from "../components/extended/OneToOneChatHeader";
import useOneToOneConvoByOtherUserQuery from "../hooks/useOneToOneConvpByOtherUserQuery";
import { getUserConvoById } from "../services/getUserConvoById";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";
import toast from "react-hot-toast";
import { toastMessages } from "@/constants/ToastMessages";
import useFindOtherUserOfOnetoOneConvo from "../hooks/useFindOtherUserOfOnetoOneConvo";

const OneToOneChatPage = () => {
  const { socket } = useChatSocketProvider();
  const { userId: otherUserId } = useParams();
  const dispath = useAppDispatch();
  const authenticatedUserId = useUserId();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { state } = useLocation();
  const find = useFindOtherUserOfOnetoOneConvo();

  const { data: convo } = useOneToOneConvoByOtherUserQuery(otherUserId, state?.convo);

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
        status: undefined,
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

          if (!recentConvoIdxHashMap[ack.message.conversationId]) {
            getUserConvoById(ack.message.conversationId)
              .then((data) => {
                if (data.convo) {
                  const convo: ConversationWithLastMessage = {
                    ...data.convo,
                    unreadCount: 0,
                    lastMessage: ack.message,
                  };
                  dispath(addToConversationList([convo]));
                }
              })
              .catch((error) =>
                console.log("error file getting new conno for first message", error),
              );
            // upadte convo list
          }
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

  const handleOnMessageUpdate = () => {
    if (!socket || !convo) return;
    socket.emit("convo-opened", { convoId: convo.id, time: new Date() });
  };

  const handleMessageDelete = async (message: Message): Promise<void> => {
    if (!socket || !convo) {
      toast.error(toastMessages.CANNOT_DELETE_MESSAGE);
      return;
    }

    const otherUser = find(convo.participants);

    dispath(
      replaceOneToOneMessage({
        otherUserId: otherUser.userId,
        messageId: message.id,
        newMessage: { ...message, sendStatus: "pending" },
      }),
    );

    socket.emit(
      "delete-one-to-one-message",
      { otherUserId: otherUser.userId, messageId: message.id },
      (ack) => {
        console.log("server-dele-ack", ack);
        if (ack) {
          dispath(
            deleteOneToOneMessage({
              otherUserId: otherUser.userId,
              // the client of the user which send the delete event will not recive "one-to-one-message" deleted event
              // we need to manually update the message optimistically
              deletedMessage: {
                ...message,
                message: "",
                status: { deleted: true, deletedAt: new Date().toString() },
              },
            }),
          );
        } else {
          toast.error(toastMessages.ERROR_DELETING_MESSAGE);
          dispath(
            replaceOneToOneMessage({
              otherUserId: otherUser.userId,
              messageId: message.id,
              newMessage: { ...message },
            }),
          );
        }
      },
    );
  };

  const throttleUserTypingEventEmmiter = () => {
    let locked: boolean = false;

    return () => {
      if (locked) return;

      if (!socket || !convo) return;
      locked = true;
      socket.emit("typing-one-to-one-message", {
        otherUserId,
        convoId: convo.id,
        time: new Date(),
      });
      console.log("fired-typing");

      setTimeout(() => {
        locked = false;
      }, 2 * 1000);
    };
  };

  return (
    <div className="relative h-screen w-full overflow-y-hidden">
      <div className="absolute top-0 z-20 w-full">
        <div className="bg-grey-dark-bg/50 backdrop-blur-lg">
          <OneToOneChatHeader otherUserId={otherUserId} convoId={convo?.id} />
        </div>
      </div>

      <OneToOneMessagesContainer
        otherUserId={otherUserId}
        containerRef={messageContainerRef}
        handleOnMessageUpdate={handleOnMessageUpdate}
        onMessageDeleteClick={handleMessageDelete}
      />

      <div className="absolute bottom-0 z-30 w-full lg:left-1/2 lg:w-4/5 lg:-translate-x-1/2">
        <SendMessageBar
          handleOnSubmit={handleOnSubmit}
          onTyping={throttleUserTypingEventEmmiter()}
        />
      </div>
    </div>
  );
};

export default OneToOneChatPage;
