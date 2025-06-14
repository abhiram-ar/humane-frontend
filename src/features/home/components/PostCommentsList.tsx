import React, { useEffect, useRef } from "react";
import Comment from "./Comment";
import Spinner from "@/components/Spinner";
import usePostCommentsInfiniteQuery from "../hooks/usePostCommentsInfiniteQuery";

const PostCommentsList: React.FC<{ postId: string }> = ({ postId }) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    usePostCommentsInfiniteQuery(postId);

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
          .flatMap((page) => page.comments)
          .map((comment) => {
            return (
              <div key={comment.id} className="border-b border-zinc-400/50 p-4">
                <Comment comment={comment} />
              </div>
            );
          })}

      <div>
        <div ref={observerRef} />

        <div className="py-5">
          {(isFetching || isLoading) && <Spinner />}

          {data && !hasNextPage && !isFetching && (
            <>
              {data && data.pages.flatMap((page) => page.comments).length === 0 ? (
                <p className="text-center text-zinc-400">No Comments be the fist one to comment</p>
              ) : (
                <p className="text-center text-sm text-zinc-400">No more Comments</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCommentsList;
