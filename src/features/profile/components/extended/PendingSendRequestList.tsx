import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
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

export type GetFriendsListResponse = {
  success: boolean;
  message: string;
  data: {
    friends: FriendList;
    from: UserListInfinityScollParams;
  };
};

type Props = {
  userId: string;
};
const FriendList: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-friends", "list", userId],
    queryFn: async () => {
      const res = await api.get<GetFriendsListResponse>("/api/v1/user/social/friend", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });

  if (isLoading) <Spinner />;

  return (
    <div className="h-100 overflow-y-auto text-white">
      {data &&
        data.friends.map((friend) => (
          <Link key={friend.id} to={`/user/${friend.id}`} target="_blank">
            <UserListItem
              profileURL={friend.avatarURL}
              userName={`${friend.firstName} ${friend.lastName ?? ""}`}
              className="mb-0"
            />
          </Link>
        ))}
    </div>
  );
};

export default FriendList;
