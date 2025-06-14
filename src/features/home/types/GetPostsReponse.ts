import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { ModerationStatus, PostVisibility } from "humane-common";

export type HydratedPost = {
  author: BasicUserDetails | undefined;
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
