import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { ModerationStatus, PostVisibility } from "humane-common";

export type FullPost = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  content: string;
  visibility: (typeof PostVisibility)[keyof typeof PostVisibility];
  moderationStatus: (typeof ModerationStatus)[keyof typeof ModerationStatus];
  moderationMetadata?: unknown;
  posterURL: string | null;
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
