export type Message = {
  id?: string;

  senderId: string;
  conversationId: string;
  message: string;

  sendAt: Date;
  isReadBy: string[];
  deletededFor: string[];

  attachment: { attachmentType: string; attachmentURL: string } | undefined;
  replyToMessageId: string | undefined;
};
