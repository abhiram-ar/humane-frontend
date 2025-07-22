export type Message = {
  id: string;

  senderId: string;
  conversationId: string;
  message: string;

  sendAt: Date;
  deletededFor: string[];

  attachment: { attachmentType: string; attachmentKey: string } | undefined;
  replyToMessageId: string | undefined;

  // only on client
  sendStatus?: "error" | "pending"
};
