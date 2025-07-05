import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type GetPublicUserHumaneScore = {
  data: {
    userId: string;
    score: number;
  } | null;
};

const usePublicHumaneScoreQuery = (userId?: string) => {
  return useQuery({
    queryKey: ["total-humane-score", userId],
    queryFn: async () => {
      const res = await api.get<GetPublicUserHumaneScore>(
        `${API_ROUTES.QUERY_SERVICE}/public/user/${userId}/humaneScore`,
      );
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export default usePublicHumaneScoreQuery;
