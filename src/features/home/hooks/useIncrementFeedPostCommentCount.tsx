import { InfiniteFeedPostData } from "../types/InfintiteFeedPostData";
import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";

const useIncrementFeedPostCommentCount = () => {
  const queryClient = useQueryClient();
  const incrementFeedPostCommentCount = (targetPostId: string) => {
    queryClient.setQueryData(["user", "feed"], (oldData: InfiniteFeedPostData) => {
      if (!oldData) return oldData;

      const newPosts = oldData.pages
        ? produce(oldData.pages, (draft) => {
            draft.forEach((page) =>
              page.posts.forEach((post) => {
                if (post && post.id === targetPostId) {
                  if (post.commentCount === null) post.commentCount = 1;
                  else post.commentCount += 1;
                }
              }),
            );
          })
        : [];

      return { pageParams: oldData.pageParams, pages: newPosts } as InfiniteFeedPostData;
    });
  };
  return { incrementFeedPostCommentCount };
};

export default useIncrementFeedPostCommentCount;
