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
    // ⚠️ Same query key for  accuratehumaneScoreQuery
    // if the return type of these query is difference there will be collision/unexpected errors

    // why are we doing this then,
    // if there is any inconsistancy b/w inconsistacny in accurateHumaneScore and public huamneScore
    // this merger of query key will do the reconsilation in the frontend
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
