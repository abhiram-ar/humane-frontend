import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { ModerationStatus, PostAttachmentStatus, PostVisibility } from "humane-common";

export type HydratedPost = {
  author: BasicUserDetails | undefined;

  id: string;
  authorId: string;
  content: string;
  visibility: (typeof PostVisibility)[keyof typeof PostVisibility];
  hashtags: string[];

  attachmentType?: string;
  rawAttachmentKey?: string | null;
  attachmentStatus?: (typeof PostAttachmentStatus)[keyof typeof PostAttachmentStatus];
  attachmentURL?: string | null;

  moderationStatus: (typeof ModerationStatus)[keyof typeof ModerationStatus];
  moderationMetadata?: unknown;

  createdAt: Date;
  updatedAt: Date;

  // additionally added
  commentCount: number | null;
};

export type GetPostResponse = {
  message: string;
  data: {
    posts: (HydratedPost | null)[];
    pagination: {
      from: string | null;
      hasMore: boolean;
    };
  };
};
