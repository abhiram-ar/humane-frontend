import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipStatusResponse } from "./useRelationshipStausQuery";

type RemoveFriendshipResponse = {
  success: boolean;
  message: string;
  data: {
    targetUserId: string;
    status: RelationshipStatus;
  };
};

const useRemoveFriendshipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user-rel-status", "remove-friendship"],
    mutationFn: async (targetUserId: string) => {
      const res = await api.delete<RemoveFriendshipResponse>(
        `/api/v1/user/social/friend/${targetUserId}`,
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

export default useRemoveFriendshipMutation;
