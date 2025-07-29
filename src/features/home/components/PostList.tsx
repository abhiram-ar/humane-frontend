import Post from "./Post";
import FeedAddComment from "./FeedAddComment";
import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/Spinner";
import useUserFeedInfiniteQuery from "../hooks/useUserFeedInfiniteQuery";
import PostListShimmer from "./PostListShimmer";

const PostList = () => {
  const observerRef = useRef<HTMLDivElement>(null);
  const { data, isFetching, isLoading, hasNextPage, fetchNextPage } = useUserFeedInfiniteQuery();
  const [showShimmer, setShowShimmer] = useState<boolean>(!data);

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

  useEffect(() => {
    if (!isLoading) setTimeout(() => setShowShimmer(false), 1000);
  }, [isLoading]);

  return (
    <div className="relative">
      {showShimmer && (
        <div
          className={`bg-grey-dark-bg absolute inset-0 z-20 transition-opacity delay-200 duration-300 ease-in ${isLoading ? "opacity-100" : "opacity-0"} `}
        >
          <PostListShimmer size={6} />
        </div>
      )}
      {data &&
        data.pages
          .flatMap((page) => [...page.posts])
          .filter((post) => (post === null ? false : true))
          .map((post) =>
            post ? (
              <div key={post.id} className="w-full border-b border-zinc-400/50">
                <Post postDetails={post} enablePosterLink={true} />
                <FeedAddComment post={post} />
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

export default PostList;
