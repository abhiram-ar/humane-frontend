import { Message } from "@/features/chat/Types/Message";
import { SendOneToOneMessageInputDTO } from "./CreateOneToOneMessage.dto";
import { Socket } from "socket.io-client";

export interface ServerToClientChatEvents {
  test: (msg: unknown) => void;
  "new-one-to-one-message": (message: Required<Message>) => void;
  "remove-noti": (noti: unknown) => void;
  "update-noti": (noti: unknown) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerChatEvents {
  hello: () => void;
  "convo-opened": (dto: { time: Date; convoId: string }) => void;
  "send-one-to-one-message": (
    dto: SendOneToOneMessageInputDTO,
    callback: (data: { message: Required<Message> | undefined; success: boolean }) => void,
  ) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export type TypedChatSocket = Socket<ServerToClientChatEvents, ClientToServerChatEvents>;
