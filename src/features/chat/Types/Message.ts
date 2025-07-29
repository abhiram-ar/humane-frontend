export type Message = {
  id: string;

  senderId: string;
  conversationId: string;
  message: string;

  sendAt: string;
  status: { deleted: boolean; deletedAt: string } | undefined;

  attachment: { attachmentType: string; attachmentURL: string | undefined } | undefined;
  replyToMessageId: string | undefined;

  // only on client
  sendStatus?: "error" | "pending";
  tempAttachment?: {
    attachmentType: string;
    attachmentKey: string;
  };
};
