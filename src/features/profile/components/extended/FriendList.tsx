import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import { api } from "@/lib/axios";
import {
  UserListInfinityScollParams,
  UserListInfinityScollQueryParams,
} from "@/types/UserInfinitryScrollParams.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
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
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: infiniteData,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-friends", "list"],
    queryFn: async ({ pageParam }) => {
      const queryParams: UserListInfinityScollQueryParams & { targetUserId: string } = {
        size: 9,
        targetUserId: userId,
      };

      if (pageParam.createdAt !== "ini" && pageParam.lastId !== "ini") {
        queryParams.createdAt = pageParam?.createdAt;
        queryParams.lastId = pageParam?.lastId;
      }
      const res = await api.get<GetFriendsListResponse>("/api/v1/user/social/friend", {
        params: queryParams,
      });
      return res.data.data;
    },
    initialPageParam: { lastId: "ini", createdAt: "ini" },
    getNextPageParam: (lastPage) => (lastPage.from?.hasMore ? lastPage.from : null),
  });

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

  return (
    <div className="h-100 overflow-y-auto py-1 text-white">
      {infiniteData &&
        infiniteData?.pages?.map((page) =>
          page?.friends?.map((user) => (
            <div key={user.id} className="mx-2 flex justify-between">
              <Link to={`/user/${user.id}`} target="">
                <UserListItem
                  profileURL={user.avatarURL}
                  userName={`${user.firstName} ${user.lastName ?? ""}`}
                  className="mb-0"
                />
              </Link>
            </div>
          )),
        )}

      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        <p className="text-center text-sm text-zinc-400">No more friends</p>
      )}

      <div ref={observerRef}></div>
    </div>
  );
};

export default FriendList;
