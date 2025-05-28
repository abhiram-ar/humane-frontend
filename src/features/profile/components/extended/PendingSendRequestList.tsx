import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/reactQuery";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import { UserListInfinityScollParams } from "@/types/UserListInfinityScrollParams.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router";
import useCancelFriendReqMutation from "../../hooks/useCancelFriendReqMutation";
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

export type GetUserSendFriendReqResponse = {
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

const PendingSendRequest: React.FC<Props> = () => {
  const { mutate: cancelFriendReq } = useCancelFriendReqMutation();

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["friend-req-send", "list"],
    queryFn: async ({ pageParam }) => {
      const queryParams =
        pageParam.createdAt === "ini" && pageParam.lastId === "ini"
          ? {
              size: 1,
            }
          : {
              createdAt: pageParam?.createdAt,
              lastId: pageParam?.lastId,
              size: 1,
            };

      const res = await api.get<GetUserSendFriendReqResponse>(
        "/api/v1/user/social/friend-req/sent",
        { params: queryParams },
      );
      return res.data.data;
    },
    initialPageParam: { lastId: "ini", createdAt: "ini" },
    getNextPageParam: (lastPage) => lastPage.from,
  });

  const handleCancelReq = (targetUserId: string) => {
    cancelFriendReq(targetUserId, {
      onSuccess: (res) => {
        queryClient.setQueryData(["friend-req-send", "list"], (oldData: typeof infiniteData) => {
          const newPagesArray =
            oldData?.pages.map((page) => ({
              friendReqs: page.friendReqs.filter((user) => user.id !== res.receiverId),
            })) ?? [];

          return {
            pages: newPagesArray,
            pageParams: oldData?.pageParams,
          };
        });
      },
    });
  };
  console.log(infiniteData);
  if (isLoading) return <Spinner />;

  return (
    <div className="h-100 overflow-y-auto text-white">
      {infiniteData &&
        infiniteData?.pages?.map((page) =>
          page?.friendReqs?.map((user) => (
            <div key={user.id} className="mx-2 flex justify-between">
              <Link to={`/user/${user.id}`} target="">
                <UserListItem
                  profileURL={user.avatarURL}
                  userName={`${user.firstName} ${user.lastName ?? ""}`}
                  className="mb-0"
                />
              </Link>

              <ButtonNeutal className="h-fit" onClick={() => handleCancelReq(user.id)}>
                Cancel Request
              </ButtonNeutal>
            </div>
          )),
        )}
      <div onClick={() => fetchNextPage()}>Load more</div>
    </div>
  );
};

export default PendingSendRequest;
