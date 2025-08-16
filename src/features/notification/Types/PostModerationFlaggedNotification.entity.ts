export const POST_MODERATION_FLAGGED_TYPE = "post-moderation-flagged";
export interface PostModerationFlaggedNotification {
  type: typeof POST_MODERATION_FLAGGED_TYPE;
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
