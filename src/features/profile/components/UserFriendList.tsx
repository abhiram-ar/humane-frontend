import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import { UserListInfinityScollParams } from "@/types/UserListInfinityScrollParams.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
const UserFriendList: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-friends", "list", userId],
    queryFn: async () => {
      const res = await api.get<GetFriendsListResponse>("/api/v1/user/social/friend");
      return res.data.data;
    },
  });

  if (isLoading) <div>loadin..</div>;

  return (
    <>
      {data &&
        data.friends.map((friend) => (
          <UserListItem
            key={friend.id}
            profileURL={friend.avatarURL}
            userName={`${friend.firstName} + ${friend.lastName ?? ""}`}
          />
        ))}
    </>
  );
};

export default UserFriendList;
