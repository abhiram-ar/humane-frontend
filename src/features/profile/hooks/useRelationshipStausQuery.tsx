import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useQuery } from "@tanstack/react-query";

export type RelationshipStatusResponse = {
  success: boolean;
  message: string;
  data: { status: RelationshipStatus };
};

const useRelationshipStausQuery = (userId: string) => {
  return useQuery({
    queryKey: ["user-rel-status", userId],
    queryFn: async () => {
      const res = await api.get<RelationshipStatusResponse>("/api/v1/user/social/rel-status", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });
};

export default useRelationshipStausQuery;
