import { Message } from "@/features/chat/Types/Message";
import { SendOneToOneMessageInputDTO } from "./CreateOneToOneMessage.dto";
import { Socket } from "socket.io-client";
import { Conversation } from "@/features/chat/Types/Conversation";

export interface ServerToClientChatEvents {
  test: (msg: unknown) => void;

  "new-one-to-one-message": (message: Message, participants: Conversation["participants"]) => void;

  "one-to-one-message-deleted": (event: {
    message: Message;
    participants: Conversation["participants"];
  }) => void;

  "typing-one-to-one-message": (event: { typingUser: string; convoId: string; time: Date }) => void;

  // -------------------------------call events-------------------------------

  "call.incoming": (event: { callerId: string; callId: string }) => void;

  "call.answered.by_other_device": (event: { callId: string; callerId: string }) => void;

  "call.connected": (event: { callId: string; recipientId: string }) => void;

  "call.sdp.offer": (event: { callId: string; offerSDP: string }) => void;

  "call.sdp.answer": (event: { callId: string; answerSDP: string }) => void;
}

export interface ClientToServerChatEvents {
  hello: () => void;

  "convo-opened": (dto: { time: Date; convoId: string }) => void;

  "delete-one-to-one-message": (
    event: { otherUserId: string; messageId: string },
    callback: (ack: boolean) => void,
  ) => void;

  "send-one-to-one-message": (
    dto: SendOneToOneMessageInputDTO,
    callback: (data: { message: Required<Message> | undefined; success: boolean }) => void,
  ) => void;

  "is-user-online": (userId: string, callback: (ack: boolean) => void) => void;

  // stop typing is handled by reciver
  "typing-one-to-one-message": (event: {
    otherUserId: string;
    convoId: string;
    time: Date;
  }) => void;

  // -------------------------------call events-------------------------------

  "call.initiate": (
    recipientId: string,
    callback: (
      res: { ringing: boolean; callId: string } | { ringing: false; error: string },
    ) => void,
  ) => void;

  "call.handup": (event: { callId: string }) => void;

  "call.action": (event: { callId: string; action: "answered" | "declined" | "timeout" }) => void;

  "call.sdp.offer": (event: { callId: string; offerSDP: string }) => void;

  "call.sdp.answer": (event: { callId: string; answerSDP: string }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export type TypedChatSocket = Socket<ServerToClientChatEvents, ClientToServerChatEvents>;
