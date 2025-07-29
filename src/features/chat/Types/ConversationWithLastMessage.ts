import { Conversation } from "./Conversation";
import { Message } from "./Message";

export type ConversationWithLastMessage = Omit<Required<Conversation>, "lastMessageId"> & {
  lastMessage: Message | undefined;
  unreadCount: number;
};
