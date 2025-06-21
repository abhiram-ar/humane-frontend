import { InfiniteData } from "@tanstack/react-query";
import { AuthorAndMetadataHydratedComment, CommentsPagination } from "./GetPostComments.types";

export type InfintiteCommentsData =
  | InfiniteData<
      {
        comments: AuthorAndMetadataHydratedComment[];
        pagination: CommentsPagination;
      },
      unknown
    >
  | undefined;
