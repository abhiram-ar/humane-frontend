import { InfiniteData } from "@tanstack/react-query";
import { FullPost } from "./GetUserTimelineResponse";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";

export type InfiniteTimelinePostData =
  | InfiniteData<
      {
        posts: FullPost[];
        pagination: {
          from: string | null;
          hasMore: boolean;
        };
        targetUserDetails: BasicUserDetails;
      },
      unknown
    >
  | undefined;
