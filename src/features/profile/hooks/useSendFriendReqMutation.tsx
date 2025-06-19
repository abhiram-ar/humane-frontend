import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipStatusResponse } from "./useRelationshipStausQuery";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";

export type SendFriendRequesetResponse = {
  success: boolean;
  message: string;
  data: {
    receiverId: string;
    status: RelationshipStatus;
  };
};

const useSendFriendReqMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user-rel-status", "send-req"],
    mutationFn: async (recieverId: string) => {
      const res = await api.post<SendFriendRequesetResponse>(
        `${API_ROUTES.USER_SERVICE}/social/friend-req`,
        {
          recieverId,
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

export default useSendFriendReqMutation;
