import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserMutualFriendList from "./UserMutualFriendList";

type GetMutualFriendsCountResponse = {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
};

type Props = {
  userId: string;
};

const UserMutualFriends: React.FC<Props> = ({ userId }) => {
  const { data } = useQuery({
    queryKey: ["user-mutual-friends", "count", userId],
    queryFn: async () => {
      const res = await api.get<GetMutualFriendsCountResponse>(
        "/api/v1/user/social/friend/mutual/count",
        {
          params: { targetUserId: userId },
        },
      );
      return res.data.data;
    },
  });

  return (
    <div>
      {data?.count ? (
        <Dialog>
          <DialogTrigger>
            <p className="decoration-pop-green cursor-pointer underline-offset-3 hover:underline">
              <span className="text-pop-green">{data?.count}</span> mutual
            </p>
          </DialogTrigger>
          <DialogContent
            className="border-grey-dark-bg bg-[#272727]"
            aria-describedby="edit profile"
          >
            <DialogHeader>
              <DialogTitle className="text-almost-white">Mutual Friends</DialogTitle>
            </DialogHeader>
            <UserMutualFriendList userId={userId} />
          </DialogContent>
        </Dialog>
      ) : (
        <p className="text-zinc-400">No mutual friends</p>
      )}
    </div>
  );
};

export default UserMutualFriends;
