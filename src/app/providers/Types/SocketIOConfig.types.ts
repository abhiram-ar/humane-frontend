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

  "update-noti": (noti: unknown) => void;

  withAck: (d: string, callback: (e: number) => void) => void;
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
}

export interface ClientToServerEvents {
  hello: () => void;
}

export type TypedChatSocket = Socket<ServerToClientChatEvents, ClientToServerChatEvents>;
