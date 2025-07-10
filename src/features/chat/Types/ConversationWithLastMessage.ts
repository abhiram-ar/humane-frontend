import { Conversation } from "./Conversation";
import { Message } from "./Message";

export type ConversationWithLastMessage = Omit<Required<Conversation>, "lastMessageId"> & {
  lastMessage: Required<Message> | undefined;
  unreadCount: number;
};
