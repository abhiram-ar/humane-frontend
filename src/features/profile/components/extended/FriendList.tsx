import Spinner from "@/components/Spinner";
import UserListItem from "@/features/search/components/UserListItem";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import useFriendsListInfniteQuery, {
  FriendList as FriendListType,
} from "../../hooks/useFriendsListInfniteQuery";

type Props = {
  userId: string;
  onUserClick?: (data: FriendListType[0]) => void;
};

const FriendList: React.FC<Props> = ({ userId, onUserClick }) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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

  const handleUserClick = (user: FriendListType[0]) => {
    if (onUserClick) {
      onUserClick(user);
      return;
    }

    navigate(`/user/${user.id}`);
  };

  return (
    <div className="h-100 overflow-y-auto pb-1 text-white">
      {infiniteData &&
        infiniteData?.pages?.map((page) =>
          page?.friends?.map((user) => (
            <div
              onClick={() => handleUserClick(user)}
              key={user.id}
              className="flex justify-between"
            >
              <UserListItem
                profileURL={user.avatarURL}
                userName={`${user.firstName} ${user.lastName ?? ""}`}
                className="mb-0"
              />
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
