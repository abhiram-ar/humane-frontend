import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import { UserListInfinityScollParams } from "@/types/UserInfinitryScrollParams.type";
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

export type GetMutualFriendsListResponse = {
  success: boolean;
  message: string;
  data: {
    mutualFriends: FriendList;
    from: UserListInfinityScollParams;
  };
};

type Props = {
  userId: string;
};
const UserMutualFriendList: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-mutual-friends", "list", userId],
    queryFn: async () => {
      const res = await api.get<GetMutualFriendsListResponse>("/api/v1/user/social/friend/mutual", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });

  if (isLoading) <Spinner />;

  return (
    <div className="h-100 overflow-y-auto text-white">
      {data &&
        data.mutualFriends.map((friend) => (
          <Link key={friend.id} to={`/user/${friend.id}`} target="_blank">
            <UserListItem
              profileURL={friend.avatarURL}
              userName={`${friend.firstName} ${friend.lastName ?? ""}`}
            />
          </Link>
        ))}
    </div>
  );
};

export default UserMutualFriendList;
