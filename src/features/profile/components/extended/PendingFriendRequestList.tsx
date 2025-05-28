import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { UserListInfinityScollParams } from "@/types/UserListInfinityScrollParams.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router";

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
  const { data, isLoading } = useQuery({
    queryKey: ["friend-req", "list", userId],
    queryFn: async () => {
      const res = await api.get<GetFriendReqResponse>("/api/v1/user/social/friend-req", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });

  if (isLoading) <Spinner />;

  return (
    <div className="h-100 overflow-y-auto text-white">
      {data &&
        data.friendReqs.map((friend) => (
          <div className="px-2 flex justify-between">
            <Link key={friend.id} to={`/user/${friend.id}`} target="">
              <UserListItem
                profileURL={friend.avatarURL}
                userName={`${friend.firstName} ${friend.lastName ?? ""}`}
                className="mb-0"
              />
            </Link>

            <button className="bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full h-fit px-4 py-1 font-semibold text-black">
              Accept Request{" "}
            </button>
          </div>
        ))}
    </div>
  );
};

export default PendingRecivedFriendRequest;
