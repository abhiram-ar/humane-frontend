import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipStatusResponse } from "./useRelationshipStausQuery";
import { API_ROUTES } from "@/lib/API_ROUTES";

type DelineFriendshipResponse = {
  success: boolean;
  message: string;
  data: {
    targetUserId: string;
    status: RelationshipStatus;
  };
};

const useDeclineFriendReqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user-rel-status", "decline-friendship"],
    mutationFn: async (targetUserId: string) => {
      const res = await api.delete<DelineFriendshipResponse>(
        `${API_ROUTES.USER_SERVICE}/social/friend-req/decline/${targetUserId}`,
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-rel-status", data.targetUserId],
        (oldData: RelationshipStatusResponse["data"]) => {
          return oldData ? { status: data.status } : oldData;
        },
      );
    },
  });
};

export default useDeclineFriendReqMutation;
