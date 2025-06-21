import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";

export type RawComment = {
  id: string;
  authorId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentMetadata = {
  likedByPostAuthor: boolean;
  likeCount: number;
  hasLikedByUser?: boolean;
};

export type AuthorHydratedComment = RawComment & {
  author: BasicUserDetails | undefined;
};

export type AuthorAndMetadataHydratedComment = AuthorHydratedComment & Partial<CommentMetadata>;

export type CommentsPagination = {
  from: string;
  hasMore: boolean;
};

export type GetCommentsResponse = {
  message: string;
  data: {
    comments: AuthorAndMetadataHydratedComment[];
    pagination: CommentsPagination;
  };
};
