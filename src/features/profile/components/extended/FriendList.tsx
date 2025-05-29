import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import useFriendsListInfniteQuery from "../../hooks/useFriendsListInfniteQuery";

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
  } = useFriendsListInfniteQuery(userId);

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
    <div className="h-100 overflow-y-auto pb-1 text-white">
      {infiniteData &&
        infiniteData?.pages?.map((page) =>
          page?.friends?.map((user) => (
            <div key={user.id} className="flex justify-between">
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
