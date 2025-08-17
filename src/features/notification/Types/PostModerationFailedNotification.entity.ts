export const POST_MODERATION_FAILED_TYPE = "post-moderation-failed";
export interface PostModerationFailedNotification {
  type: typeof POST_MODERATION_FAILED_TYPE;
  updatedAt: string;
  createdAt: string;
  id: string;
  isRead: boolean;

  reciverId: string;
  entityId: string; // here the entity reffered will be postId
  metadata: {
    moderationResult: unknown;
  };
}
