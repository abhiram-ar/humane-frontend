import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type GetTotalHumaneScore = {
  data: {
    userId: string;
    score: number;
  } | null;
};

const useGetAccurateHumaneScore = (userId?: string) => {
  return useQuery({
    queryKey: ["total-humane-score", userId],
    queryFn: async () => {
      const res = await api.get<GetTotalHumaneScore>(`${API_ROUTES.REWARD_ROUTE}/total`, {
        params: { userId: userId || undefined },
      });
      return res.data;
    },
    enabled: !!userId,
  });
};

export default useGetAccurateHumaneScore;
