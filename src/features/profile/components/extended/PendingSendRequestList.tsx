import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/reactQuery";
import { RelationshipStatus } from "@/types/RelationshipStatus";
import {
  UserListInfinityScollParams,
  UserListInfinityScollQueryParams,
} from "@/types/UserInfinitryScrollParams.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import useCancelFriendReqMutation from "../../hooks/useCancelFriendReqMutation";
import ButtonNeutal from "@/components/ButtonNeutal";

// TODO: reafacor


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
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["friend-req-send", "list"],
    queryFn: async ({ pageParam }) => {
      const queryParams: UserListInfinityScollQueryParams = { size: 9 };

      if (pageParam.createdAt !== "ini" && pageParam.lastId !== "ini") {
        queryParams.createdAt = pageParam?.createdAt;
        queryParams.lastId = pageParam?.lastId;
      }

      const res = await api.get<GetUserSendFriendReqResponse>(
        "/api/v1/user/social/friend-req/sent",
        { params: queryParams },
      );
      return res.data.data;
    },
    initialPageParam: { lastId: "ini", createdAt: "ini" },
    getNextPageParam: (lastPage) => (lastPage.from?.hasMore ? lastPage.from : null),
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

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entity) => {
      if (entity[0].isIntersecting && !isFetching && hasNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  });

  return (
    <div className="h-100 overflow-y-auto py-1 text-white">
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

      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        <p className="text-center text-sm text-zinc-400">No more request</p>
      )}

      <div ref={observerRef}></div>
    </div>
  );
};

export default PendingSendRequest;
