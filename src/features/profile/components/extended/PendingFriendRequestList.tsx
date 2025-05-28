import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { UserListInfinityScollParams } from "@/types/UserListInfinityScrollParams.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router";
import useAcceptFriendReqMutation from "../../hooks/useAcceptFriendReqMutation";
import useRemoveFriendshipMutation from "../../hooks/useRemoveFriendshipMutation";
import ButtonPop from "@/components/ButtonPop";
import ButtonNeutal from "@/components/ButtonNeutal";

// TODO: reafacor
export type FriendList = {
  id: string;
  firstName: string;
  lastName?: string | null;
  status: "PENDING" | "ACCEPTED";
  avatarURL: string | null;
}[];

export type FriendRequestList = {
  id: string;
  firstName: string;
  lastName?: string;
  createdAt: string;
  status: RelationshipStatus;
  avatarURL: string | null;
}[];

export type GetFriendReqResponse = {
  success: boolean;
  message: string;
  data: {
    friendReqs: FriendRequestList;
    from: UserListInfinityScollParams;
  };
};

type Props = {
  userId: string;
};
const PendingRecivedFriendRequest: React.FC<Props> = ({ userId }) => {
  const { mutate: acceptFriendReq } = useAcceptFriendReqMutation();
  const { mutate: declineFriendReq } = useRemoveFriendshipMutation();
  const { data, isLoading } = useQuery({
    queryKey: ["friend-req", "list", userId],
    queryFn: async () => {
      const res = await api.get<GetFriendReqResponse>("/api/v1/user/social/friend-req", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });

  const queryClient = useQueryClient();

  const handleAcceptReq = (targetUserId: string) => {
    acceptFriendReq(targetUserId, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["friend-req", "list", userId],
          (oldData: GetFriendReqResponse["data"]) => {
            return oldData
              ? ({
                  ...oldData,
                  friendReqs: oldData.friendReqs.filter((req) => req.id !== data.requesterId),
                } as GetFriendReqResponse["data"])
              : oldData;
          },
        );
      },
    });
  };

  const handleDeclineReq = (targetUserId: string) => {
    declineFriendReq(targetUserId, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["friend-req", "list", userId],
          (oldData: GetFriendReqResponse["data"]) => {
            return oldData
              ? ({
                  ...oldData,
                  friendReqs: oldData.friendReqs.filter((req) => req.id !== data.targetUserId),
                } as GetFriendReqResponse["data"])
              : oldData;
          },
        );
      },
    });
  };

  if (isLoading) <Spinner />;

  return (
    <div className="h-100 overflow-y-auto text-white">
      {data &&
        data.friendReqs.map((friend) => (
          <div className="flex justify-between px-2">
            <Link key={friend.id} to={`/user/${friend.id}`} target="">
              <UserListItem
                profileURL={friend.avatarURL}
                userName={`${friend.firstName} ${friend.lastName ?? ""}`}
                className="mb-0"
              />
            </Link>

            <div className="flex gap-1">
              <ButtonPop className="h-fit" onClick={() => handleAcceptReq(friend.id)}>
                Accept
              </ButtonPop>
              <ButtonNeutal className="h-fit" onClick={() => handleDeclineReq(friend.id)}>
                Decline
              </ButtonNeutal>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PendingRecivedFriendRequest;
