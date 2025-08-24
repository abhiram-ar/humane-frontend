import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import useAcceptFriendReqMutation from "../../hooks/useAcceptFriendReqMutation";
import ButtonPop from "@/components/ButtonPop";
import ButtonNeutal from "@/components/ButtonNeutal";
import useRecivedFriendReqInfiniteQuery from "../../hooks/useRecivedFriendReqInfiniteQuery";
import useDeclineFriendReqMutation from "../../hooks/useDeclineFriendReqMutation";

// TODO: reafacor

type Props = {
  userId: string;
};
const PendingRecivedFriendRequest: React.FC<Props> = () => {
  const { mutate: acceptFriendReq } = useAcceptFriendReqMutation();
  const { mutate: declineFriendReq } = useDeclineFriendReqMutation();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const {
    data: infiniteData,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useRecivedFriendReqInfiniteQuery();

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entity) => {
      if (entity[0].isIntersecting && !isFetching && hasNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const handleAcceptReq = (targetUserId: string) => {
    acceptFriendReq(targetUserId, {
      onSuccess: (res) => {
        queryClient.setQueryData(["friend-req-recived", "list"], (oldData: typeof infiniteData) => {
          const newPagesArray =
            oldData?.pages.map((page) => ({
              ...page,
              friendReqs: page.friendReqs.filter((user) => user.id !== res.requesterId),
            })) ?? [];

          return {
            pages: newPagesArray,
            pageParams: oldData?.pageParams,
          };
        });
      },
    });
  };

  const handleDeclineReq = (targetUserId: string) => {
    declineFriendReq(targetUserId, {
      onSuccess: (res) => {
        queryClient.setQueryData(["friend-req-recived", "list"], (oldData: typeof infiniteData) => {
          const newPagesArray =
            oldData?.pages.map((page) => ({
              ...page,
              friendReqs: page.friendReqs.filter((user) => user.id !== res.targetUserId),
            })) ?? [];

          return {
            pages: newPagesArray,
            pageParams: oldData?.pageParams,
          };
        });
      },
    });
  };

  if (isLoading) <Spinner />;

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

              <div className="flex gap-1">
                <ButtonPop className="h-fit" onClick={() => handleAcceptReq(user.id)}>
                  Accept
                </ButtonPop>
                <ButtonNeutal className="h-fit" onClick={() => handleDeclineReq(user.id)}>
                  Decline
                </ButtonNeutal>
              </div>
            </div>
          )),
        )}
      <div className="border" ref={observerRef}></div>

      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        <p className="text-center text-sm text-zinc-400">No more request</p>
      )}
    </div>
  );
};

export default PendingRecivedFriendRequest;
