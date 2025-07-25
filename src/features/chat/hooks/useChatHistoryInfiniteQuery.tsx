import { CurosrPagination } from "@/types/CursorPagination.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Message } from "../Types/Message";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";

type GetOneToOneMessagesResponse = {
  data: { messages: Message[]; pagination: CurosrPagination };
};

const useChatHistoryInfiniteQuery = (otherUserId: string, fromMessage?: Message | undefined) => {
  let fromString: string | undefined;
  if (fromMessage) {
    fromString = `${new Date(fromMessage.sendAt).toISOString()}|${fromMessage.id}`;
  }

  return useInfiniteQuery({
    queryKey: ["one-to-one-messages", otherUserId],
    queryFn: async (data) => {
      const param =
        data.pageParam === "init"
          ? {
              limit: 20,
              otherUserId,
            }
          : {
              limit: 10,
              from: data.pageParam,
              otherUserId,
            };

      const res = await api.get<GetOneToOneMessagesResponse>(
        `${API_ROUTES.CHAT_ROUTE}/convo/one-to-one/messages`,
        { params: param },
      );
      return res.data.data;
    },
    initialPageParam: fromString ?? "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
    staleTime: Infinity,
  });
};

export default useChatHistoryInfiniteQuery;
