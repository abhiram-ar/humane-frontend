export type Message = {
  id: string;

  senderId: string;
  conversationId: string;
  message: string;

  sendAt: Date;
  isReadBy: string[];
  status: { deleted: boolean; deletedAt: Date } | undefined;

  attachment: { attachmentType: string; attachmentURL: string } | undefined;
  replyToMessageId: string | undefined;
};
