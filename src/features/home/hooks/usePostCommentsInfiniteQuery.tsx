import { API_ROUTES } from "@/lib/API_ROUTES";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetCommentsResponse } from "../types/GetPostComments.types";
import { api } from "@/lib/axios";

const usePostCommentsInfiniteQuery = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam }) => {
      const params: { from?: string; limit: number } =
        pageParam === "init"
          ? {
              limit: 10,
            }
          : {
              limit: 6,
              from: pageParam,
            };
      const res = await api.get<GetCommentsResponse>(
        `${API_ROUTES.QUERY_SERVICE}/post/${postId}/comment`,
        { params },
      );
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });
};

export default usePostCommentsInfiniteQuery;
