import { api } from "@/lib/axios";
import {
  UserListInfinityScollParams,
  UserListInfinityScollQueryParams,
} from "@/types/UserInfinitryScrollParams.type";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FriendList = {
  id: string;
  firstName: string;
  lastName?: string | null;
  status: "PENDING" | "ACCEPTED";
  avatarURL: string | null;
}[];

export type GetMutualFriendsListResponse = {
  success: boolean;
  message: string;
  data: {
    mutualFriends: FriendList;
    from: UserListInfinityScollParams;
  };
};

const useMutualFriendsListInfniteQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["user-mutual-friends", "list", userId],
    queryFn: async ({ pageParam }) => {
      const queryParams: UserListInfinityScollQueryParams & { targetUserId: string } = {
        size: 9,
        targetUserId: userId,
      };

      if (pageParam.createdAt !== "ini" && pageParam.lastId !== "ini") {
        queryParams.createdAt = pageParam?.createdAt;
        queryParams.lastId = pageParam?.lastId;
      }
      const res = await api.get<GetMutualFriendsListResponse>("/api/v1/user/social/friend/mutual", {
        params: queryParams,
      });
      return res.data.data;
    },
    initialPageParam: { lastId: "ini", createdAt: "ini" },
    getNextPageParam: (lastPage) => (lastPage.from?.hasMore ? lastPage.from : null),
  });
};

export default useMutualFriendsListInfniteQuery;
