import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import {
  UserListInfinityScollParams,
  UserListInfinityScollQueryParams,
} from "@/types/UserInfinitryScrollParams.type";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FriendRequestList = {
  id: string;
  firstName: string;
  lastName?: string;
  createdAt: string;
  status: RelationshipStatus;
  avatarURL: string | null;
}[];

export type GetFriendReqResponse = {
  success: boolean;
  message: string;
  data: {
    friendReqs: FriendRequestList;
    from: UserListInfinityScollParams;
  };
};

const useRecivedFriendReqInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: ["friend-req-recived", "list"],
    queryFn: async ({ pageParam }) => {
      const queryParams: UserListInfinityScollQueryParams = { size: 9 };

      if (pageParam.createdAt !== "ini" && pageParam.lastId !== "ini") {
        queryParams.createdAt = pageParam?.createdAt;
        queryParams.lastId = pageParam?.lastId;
      }

      const res = await api.get<GetFriendReqResponse>(
        `${API_ROUTES.USER_SERVICE}/social/friend-req`,
        {
          params: queryParams,
        },
      );
      return res.data.data;
    },
    initialPageParam: { lastId: "ini", createdAt: "ini" },
    getNextPageParam: (lastPage) => (lastPage.from ? lastPage.from : null),
  });
};

export default useRecivedFriendReqInfiniteQuery;
