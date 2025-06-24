export const POST_GOT_COMMNET_NOTIFICATION_TYPE = "post-got-comment";
export interface PostGotCommentNotification {
  reciverId: string;
  actorId: string;
  entityId: string; // here the entity reffered will be commentId
  metadata: {
    postId: string;
    commentContent: string; // we can remove depency of ES proxy/writer to read comment contenct on read time, also commnets are immutable in system. So dont want to worry about updating this
  };
  type: typeof POST_GOT_COMMNET_NOTIFICATION_TYPE;
  id: string;
  updatedAt: string;
  createdAt: string;
  isRead: boolean;
}
