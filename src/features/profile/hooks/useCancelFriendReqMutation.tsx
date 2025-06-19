import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipStatusResponse } from "./useRelationshipStausQuery";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";

type CancelFriendRequesetResponse = {
  success: boolean;
  message: string;
  data: {
    receiverId: string;
    status: RelationshipStatus;
  };
};

const useCancelFriendReqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user-rel-status", "cancel-req"],
    mutationFn: async (recieverId: string) => {
      const res = await api.delete<CancelFriendRequesetResponse>(
        `${API_ROUTES.USER_SERVICE}/social/friend-req`,
        {
          data: { recieverId },
        },
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-rel-status", data.receiverId],
        (oldData: RelationshipStatusResponse["data"]) => {
          return oldData ? { status: data.status } : oldData;
        },
      );
    },
  });
};

export default useCancelFriendReqMutation;
