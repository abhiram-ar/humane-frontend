export const COMMENT_LIKES_NOTIFICATION_TYPE = "comment-likes";
export type CommentLikesNotification = {
  type: typeof COMMENT_LIKES_NOTIFICATION_TYPE;
  updatedAt: string;
  createdAt: string;
  id: string;
  isRead: boolean;

  reciverId: string;
  entityId: string; // here the entity reffered will be commentId
  metadata: {
    postId: string;
    likeCount: number;
    recentLikes: { userId: string; likeId: string }[]; // userId data will be fetched by frontend as FFB or BE sync req
  };
};
