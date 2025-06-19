import { InfiniteData } from "@tanstack/react-query";
import { HydratedPost } from "./GetPostsReponse";

export type InfiniteFeedPostData =
  | InfiniteData<
      {
        posts: (HydratedPost | null)[];
        pagination: {
          from: string | null;
          hasMore: boolean;
        };
      },
      unknown
    >
  | undefined;
