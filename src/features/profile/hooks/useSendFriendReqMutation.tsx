import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipStatusResponse } from "./useRelationshipStausQuery";
import { api } from "@/lib/axios";

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
      const res = await api.post<SendFriendRequesetResponse>("/api/v1/user/social/friend-req", {
        recieverId,
      });
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
