import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { InfiniteTimelinePostData } from "../Types/InfiniteTimelinePostData";

const useIncrementTimelinePostCommentCount = (targetUserId: string) => {
  const queryClient = useQueryClient();

  const incrementTimelinePostCommentCount = (targetPostId: string) => {
    queryClient.setQueryData(["timeline", targetUserId], (oldData: InfiniteTimelinePostData) => {
      if (!oldData) return oldData;

      const newPosts = oldData.pages
        ? produce(oldData.pages, (draft) => {
            draft.forEach((page) =>
              page.posts.forEach((post) => {
                if (post && post.id === targetPostId) {
                  if (!post.commentCount) post.commentCount = 1;
                  else post.commentCount += 1;
                }
              }),
            );
          })
        : [];

      return { pageParams: oldData.pageParams, pages: newPosts } as InfiniteTimelinePostData;
    });
  };
  return { incrementTimelinePostCommentCount };
};

export default useIncrementTimelinePostCommentCount;
