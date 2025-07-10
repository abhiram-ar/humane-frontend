import { Message } from "@/features/chat/Types/Message";
import { SendOneToOneMessageInputDTO } from "./CreateOneToOneMessage.dto";
import { Socket } from "socket.io-client";

export interface ServerToClientChatEvents {
  test: (msg: unknown) => void;
  "new-message": (message: Message) => void;
  "remove-noti": (noti: unknown) => void;
  "update-noti": (noti: unknown) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerChatEvents {
  hello: () => void;
  "send-one-to-one-message": (
    dto: SendOneToOneMessageInputDTO,
    callback: (ack: boolean) => void,
  ) => void;
}

export type TypedChatSocket = Socket<ServerToClientChatEvents, ClientToServerChatEvents>;
