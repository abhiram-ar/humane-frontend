import { api } from '@/lib/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { GetPostResponse } from '../types/GetPostsReponse';
import { API_ROUTES } from '@/lib/API_ROUTES';

const useUserFeedInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: ["user", "feed"],
    queryFn: async (data) => {
      const param =
        data.pageParam === "init"
          ? {
              limit: 3,
            }
          : {
              limit: 3,
              from: data.pageParam,
            };

      const res = await api.get<GetPostResponse>(`${API_ROUTES.FEED_SERVICE}/`, { params: param });
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });

}

export default useUserFeedInfiniteQuery
