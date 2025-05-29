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

export type GetFriendsListResponse = {
  success: boolean;
  message: string;
  data: {
    friends: FriendList;
    from: UserListInfinityScollParams;
  };
};

const useFriendsListInfniteQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["user-friends", "list", userId],
    queryFn: async ({ pageParam }) => {
      const queryParams: UserListInfinityScollQueryParams & { targetUserId: string } = {
        size: 9,
        targetUserId: userId,
      };

      if (pageParam.createdAt !== "ini" && pageParam.lastId !== "ini") {
        queryParams.createdAt = pageParam?.createdAt;
        queryParams.lastId = pageParam?.lastId;
      }
      const res = await api.get<GetFriendsListResponse>("/api/v1/user/social/friend", {
        params: queryParams,
      });
      return res.data.data;
    },
    initialPageParam: { lastId: "ini", createdAt: "ini" },
    getNextPageParam: (lastPage) => (lastPage.from?.hasMore ? lastPage.from : null),
  });
};

export default useFriendsListInfniteQuery;
