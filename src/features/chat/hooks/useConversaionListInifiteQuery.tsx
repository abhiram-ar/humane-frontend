import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { CurosrPagination } from "@/types/CursorPagination.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";

export type GetUserRecentConvoReponse = {
  data: {
    pagination: CurosrPagination;
    conversations: (ConversationWithLastMessage & { otherUser: BasicUserDetails })[];
  };
};

const useConversaionListInifiteQuery = () => {
  return useInfiniteQuery({
    queryKey: ["recent-converstions-list"],
    queryFn: async ({ pageParam }) => {
      const params =
        pageParam === "ini"
          ? {
              limit: 10,
            }
          : {
              limit: 5,
              from: pageParam,
            };

      const res = await api.get<GetUserRecentConvoReponse>(`${API_ROUTES.CHAT_ROUTE}/recent`, {
        params,
      });
      return res.data.data;
    },
    initialPageParam: "ini",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
    staleTime: 10 * 1000,
  });
};

export default useConversaionListInifiteQuery;
