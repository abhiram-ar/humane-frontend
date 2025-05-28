import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { shimmer } from "@/constants/shimmerStyle";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserFriendList from "./UserFriendList";

type GetFriendsCountResponse = {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
};

type Props = {
  userId: string;
};

const UserFriends: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-friends", "count", userId],
    queryFn: async () => {
      const res = await api.get<GetFriendsCountResponse>("/api/v1/user/social/friend/count", {
        params: { targetUserId: userId },
      });
      return res.data.data;
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <p className="decoration-pop-green cursor-pointer underline-offset-3 hover:underline">
            <span className={`text-pop-green ${isLoading && shimmer + " w-10"}`}>
              {data?.count}
            </span>{" "}
            humans in circle
          </p>
        </DialogTrigger>
        <DialogContent className="border-grey-dark-bg bg-[#272727]" aria-describedby="edit profile">
          <DialogHeader>
            <DialogTitle className="text-almost-white">Friends</DialogTitle>
          </DialogHeader>
          <UserFriendList userId={userId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserFriends;
