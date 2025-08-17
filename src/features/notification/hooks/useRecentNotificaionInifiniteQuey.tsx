import { API_ROUTES } from "@/lib/API_ROUTES";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetRecentNotificationResponse } from "../Types/GetRecentNotificationResponse";
import { api } from "@/lib/axios";

const useRecentNotificaionInifiniteQuey = () => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
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
      const res = await api.get<GetRecentNotificationResponse>(
        `${API_ROUTES.NOTIFICATION_SERVICE}/`,
        {
          params,
        },
      );
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasmore ? lastPage.pagination.from : null),
  });
};

export default useRecentNotificaionInifiniteQuey;
