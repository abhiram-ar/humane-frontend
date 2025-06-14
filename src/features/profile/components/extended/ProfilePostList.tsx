import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { GetUserPostTimelineResponse } from "../../Types/GetUserTimelineResponse";
import { api } from "@/lib/axios";
import Post from "@/features/home/components/Post";
import UserPostActions from "./UserPostActions";
import useUserId from "../../hooks/useUserId";
import FeedAddComment from "@/features/home/components/FeedAddComment";
import Spinner from "@/components/Spinner";

type Props = {
  userId: string;
};
const ProfilePostList: React.FC<Props> = ({ userId }) => {
  const authenticatedUserId = useUserId();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["timeline", userId],
    queryFn: async (data) => {
      const param =
        data.pageParam === "init"
          ? {
              limit: 2,
            }
          : {
              limit: 2,
              from: data.pageParam,
            };

      const res = await api.get<GetUserPostTimelineResponse>(
        `/api/v1/query/post/timeline/${userId}`,
        { params: param },
      );
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver((entry) => {
      // make sure we dont fetch the page when a request is in flight
      if (entry[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

  return (
    <div>
      {data &&
        data.pages
          .flatMap((page) => [...page.posts])
          .map((post) =>
            post ? (
              <div key={post.id} className="relative w-full border-b border-zinc-400/50 px-5">
                <div className="absolute top-2 right-2">
                  {authenticatedUserId === userId && <UserPostActions postId={post.id} />}
                </div>
                <Post
                  postDetails={{
                    ...post,
                    author: { ...data.pages[0].targetUserDetails },
                  }}
                />
                <FeedAddComment postId={post.id} />
              </div>
            ) : null,
          )}

      <div>
        <div ref={observerRef} />

        <div className="py-5">
          {(isFetching || isLoading) && <Spinner />}

          {data && !hasNextPage && !isFetching && (
            <p className="text-center text-sm text-zinc-400">No more Posts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePostList;
