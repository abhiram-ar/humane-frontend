import { InfiniteData } from "@tanstack/react-query";
import { AuthorHydratedComment, CommentsPagination } from "./GetPostComments.types";

export type InfintiteCommentsData =
  | InfiniteData<
      {
        comments: AuthorHydratedComment[];
        pagination: CommentsPagination;
      },
      unknown
    >
  | undefined;
