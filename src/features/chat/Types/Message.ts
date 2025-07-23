export type Message = {
  id: string;

  senderId: string;
  conversationId: string;
  message: string;

  sendAt: string;
  deletededFor: string[];

  attachment: { attachmentType: string; attachmentURL: string | undefined } | undefined;
  replyToMessageId: string | undefined;

  // only on client
  sendStatus?: "error" | "pending";
};
