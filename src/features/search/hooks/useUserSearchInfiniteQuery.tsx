import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollResponse } from "../Types/SearchResult";

const useUserSearchInfiniteQuery = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["find-users", query],
    queryFn: async ({ pageParam }) => {
      const queryParams =
        pageParam !== 0
          ? {
              searchQuery: query,
              searchAfter: pageParam,
              limit: 15,
            }
          : {
              searchQuery: query,
              limit: 15,
            };

      const res = await api.get<InfiniteScrollResponse>(`${API_ROUTES.QUERY_SERVICE}/public/user`, {
        params: queryParams,
      });
      return res.data.data;
    },
    initialPageParam: 0,
    // note: in our api, if send the request after the last page, cusor will be null
    // returing undefined makes the hasNestPage turn false
    getNextPageParam: (lastPage) => (lastPage.scroll.hasMore ? lastPage.scroll.cursor : undefined),
    enabled: query!.trim().length > 2, // dont want to fire a query if for short string
  });
};

export default useUserSearchInfiniteQuery;
