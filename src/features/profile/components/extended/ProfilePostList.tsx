import React, { ComponentPropsWithoutRef, useEffect, useRef } from "react";
import Post from "@/features/home/components/Post";
import UserPostActions from "./UserPostActions";
import useUserId from "../../../../hooks/useUserId";
import FeedAddComment from "@/features/home/components/FeedAddComment";
import Spinner from "@/components/Spinner";
import useProfilePostTimeline from "../../hooks/userProfilePostTimeline";
import ModerationMessages from "@/features/home/components/ModerationMessages";

type Props = ComponentPropsWithoutRef<"div"> & {
  userId: string;
};
const ProfilePostList: React.FC<Props> = ({ userId, className }) => {
  const authenticatedUserId = useUserId();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    useProfilePostTimeline(userId);

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
          .flatMap((page) => page.posts)
          .filter((post) => post)
          .map((post) => (
            <div
              key={post.id}
              className={`relative w-full border-b border-zinc-400/50 lg:px-5 ${post.moderationStatus === "pending" || post.moderationStatus === "failed" ? "bg-amber-600/20" : ""} ${post.moderationStatus === "notAppropriate" ? "bg-red-700/50" : ""} ${className}`}
            >
              {post.moderationStatus !== "ok" && (
                <ModerationMessages moderationStatus={post.moderationStatus} />
              )}

              <div className="absolute top-2 right-2">
                {authenticatedUserId === userId && <UserPostActions postId={post.id} />}
              </div>
              <Post
                postDetails={{
                  ...post,
                  author: { ...data.pages[0].targetUserDetails },
                }}
              />

              <FeedAddComment
                disabled={post.moderationStatus !== "ok"}
                post={{
                  ...post,
                  author: { ...data.pages[0].targetUserDetails },
                }}
              />
            </div>
          ))}

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
