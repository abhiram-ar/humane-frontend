export type TempDeletedMessage = {
  id: string;
  senderId: string;
  conversationId: string;
  sendAt: Date;
  deleted: true;
};
