import { useInfiniteQuery } from "@tanstack/react-query";
import { GetUserPostTimelineResponse } from "../Types/GetUserTimelineResponse";
import { api } from "@/lib/axios";

const useProfilePostTimeline = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["timeline", userId],
    queryFn: async (data) => {
      const param =
        data.pageParam === "init"
          ? {
              limit: 5,
            }
          : {
              limit: 5,
              from: data.pageParam,
            };

      const res = await api.get<GetUserPostTimelineResponse>(
        `/api/v1/query/post/timeline/${userId}`,
        { params: param },
      );
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });
};

export default useProfilePostTimeline;
