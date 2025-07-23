export type Message = {
  id: string;

  senderId: string;
  conversationId: string;
  message: string;

  sendAt: string;
  deletededFor: string[];

  attachment: { attachmentType: string; attachmentKey: string } | undefined;
  replyToMessageId: string | undefined;

  // only on client
  sendStatus?: "error" | "pending"
};
