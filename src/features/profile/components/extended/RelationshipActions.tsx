import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string;
};

type RelationshipStatus =
  | "sameUser"
  | "strangers"
  | "friends"
  | "friendreqSend"
  | "friendReqWaitingApproval"
  | "blocked";

type RelationshipStatusResponse = {
  success: boolean;
  message: string;
  data: { status: RelationshipStatus };
};

type SendFriendRequesetResponse = {
  success: boolean;
  message: string;
  data: {
    receiverId: string;
    status: RelationshipStatus;
  };
};

type CancelFriendRequesetResponse = {
  success: boolean;
  message: string;
  data: {
    receiverId: string;
    status: RelationshipStatus;
  };
};

type AcceptFriendRequesetResponse = {
  success: boolean;
  message: string;
  data: {
    requesterId: string;
    status: RelationshipStatus;
  };
};

type RemoveFriendshipResponse = {
  success: boolean;
  message: string;
  data: {
    targetUserId: string;
    status: RelationshipStatus;
  };
};

const RelationshipActions: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-rel-status", userId],
    queryFn: async () => {
      const res = await api.get<RelationshipStatusResponse>("/api/v1/user/social/rel-status", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: sendFriendRequest } = useMutation({
    mutationKey: ["user-rel-status", "send-req", userId],
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

  const { mutate: cancelFriendReq } = useMutation({
    mutationKey: ["user-rel-status", "cancel-req", userId],
    mutationFn: async (recieverId: string) => {
      const res = await api.delete<CancelFriendRequesetResponse>("/api/v1/user/social/friend-req", {
        data: { recieverId },
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

  const { mutate: accpetFriendReq } = useMutation({
    mutationKey: ["user-rel-status", "accept-req", userId],
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

  const { mutate: removeFriendship } = useMutation({
    mutationKey: ["user-rel-status", "remove-friendship", userId],
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

  if (isLoading)
    return (
      <Skeleton className="w-30 rounded-full">
        <button className="px-4 py-1">.</button>
      </Skeleton>
    );

  return (
    <div>
      {data?.status === "strangers" && (
        <button
          className="bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full px-4 py-1 font-semibold text-black"
          onClick={() => sendFriendRequest(userId)}
        >
          Add Friend{" "}
        </button>
      )}

      {data?.status === "friendReqWaitingApproval" && (
        <div className="flex gap-2">
          <button
            className="bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full px-4 py-1 font-semibold text-black"
            onClick={() => accpetFriendReq(userId)}
          >
            Accept Request{" "}
          </button>
          <button
            className="bg-offwhite cursor-pointer rounded-full px-4 py-1 font-semibold text-black hover:bg-white"
            onClick={() => removeFriendship(userId)}
            title="cancel"
          >
            Decline
          </button>
        </div>
      )}

      {data?.status === "friendreqSend" && (
        <button
          className="bg-offwhite cursor-pointer rounded-full px-4 py-1 font-semibold text-black hover:bg-white"
          onClick={() => cancelFriendReq(userId)}
          title="cancel"
        >
          cancel Request
        </button>
      )}

      {data?.status === "friends" && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="cursor-pointer rounded-full bg-zinc-400/90 px-4 py-1 font-semibold text-black hover:bg-zinc-400">
                Remove Friend
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to remove this friend?</AlertDialogTitle>
                <AlertDialogDescription>You cannot undo this action.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeFriendship(userId)}
                  className="bg-red-blood cursor-pointer rounded-2xl ease-out hover:bg-red-800"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default RelationshipActions;
