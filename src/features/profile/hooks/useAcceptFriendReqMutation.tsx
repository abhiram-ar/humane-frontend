import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipStatusResponse } from "./useRelationshipStausQuery";

type AcceptFriendRequesetResponse = {
  success: boolean;
  message: string;
  data: {
    requesterId: string;
    status: RelationshipStatus;
  };
};

const useAcceptFriendReqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user-rel-status", "accept-req"],
    mutationFn: async (requesterId: string) => {
      const res = await api.patch<AcceptFriendRequesetResponse>(
        "/api/v1/user/social/friend-req/status",
        { requesterId },
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-rel-status", data.requesterId],
        (oldData: RelationshipStatusResponse["data"]) => {
          return oldData ? { status: data.status } : oldData;
        },
      );
    },
  });
};

export default useAcceptFriendReqMutation;
