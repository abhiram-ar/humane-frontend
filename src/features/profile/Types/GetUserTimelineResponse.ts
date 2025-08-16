import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { ModerationStatus, PostAttachmentStatus, PostVisibility } from "humane-common";

export type FullPost = {
  id: string;
  authorId: string;
  content: string;
  visibility: (typeof PostVisibility)[keyof typeof PostVisibility];
  hashtags: string[];

  attachmentType?: string;
  rawAttachmentKey?: string | null;
  attachmentStatus?: (typeof PostAttachmentStatus)[keyof typeof PostAttachmentStatus];
  attachmentURL?: string | null;

  moderationStatus: (typeof ModerationStatus)[keyof typeof ModerationStatus]
  moderationMetadata?: unknown;

  createdAt: Date;
  updatedAt: Date;

  // additionally added
  commentCount: number | null;
};

export type GetUserPostTimelineResponse = {
  message: string;
  data: {
    posts: FullPost[];
    pagination: {
      from: string | null;
      hasMore: boolean;
    };
    targetUserDetails: BasicUserDetails;
  };
};
