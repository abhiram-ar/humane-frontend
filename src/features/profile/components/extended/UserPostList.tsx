import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { GetUserPostTimelineResponse } from "../../Types/GetUserTimelineResponse";
import { api } from "@/lib/axios";
import Post from "@/features/home/components/Post";

type Props = {
  userId: string;
};
const UserPostList: React.FC<Props> = ({ userId }) => {
  const { data } = useInfiniteQuery({
    queryKey: ["timeline", userId],
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

      const res = await api.get<GetUserPostTimelineResponse>(
        `/api/v1/query/post/timeline/${userId}`,
        { params: param },
      );
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });

  const auth = data?.pages[0].posts.map((post) => post.id);
  console.log("aut", auth);

  return (
    <div>
      {data &&
        data.pages
          .flatMap((page) => [...page.posts])
          .map((post) =>
            post ? (
              <div key={post.id} className="w-full border-b border-zinc-400/50 px-5">
                <Post
                  postDetails={{
                    ...post,
                    author: { ...data.pages[0].targetUserDetails },
                  }}
                />
              </div>
            ) : null,
          )}
    </div>
  );
};

export default UserPostList;
