import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type GetTotalHumaneScore = {
  data: {
    userId: string;
    score: number;
  } | null;
};

const useAccurateHumaneScoreQuery = (userId?: string) => {
  return useQuery({
    // ⚠️ Same query key for public humanceScore query
    // if the return type of these query is difference there will be collision/unexpected errors
    queryKey: ["total-humane-score", userId],
    queryFn: async () => {
      const res = await api.get<GetTotalHumaneScore>(`${API_ROUTES.REWARD_ROUTE}/total`, {
        params: { userId: userId || undefined },
      });
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export default useAccurateHumaneScoreQuery;
