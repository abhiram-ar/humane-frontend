import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { api } from "@/lib/axios";
import { GetPostResponse } from "../types/GetPostsReponse";
import FeedAddComment from "./FeedAddComment";

const PostList = () => {
  const { data } = useInfiniteQuery({
    queryKey: ["user", "feed"],
    queryFn: async (data) => {
      const param =
        data.pageParam === "init"
          ? {
              limit: 10,
            }
          : {
              limit: 10,
              from: data.pageParam,
            };

      const res = await api.get<GetPostResponse>("/api/v1/feed/", { params: param });
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });

  return (
    <div>
      {data &&
        data.pages
          .flatMap((page) => [...page.posts])
          .filter((post) => (post === null ? false : true))
          .map((post) =>
            post ? (
              <div key={post.id} className="w-full border-b border-zinc-400/50">
                <Post postDetails={post} />
                <FeedAddComment post={post} />
              </div>
            ) : null,
          )}
    </div>
  );
};

export default PostList;
