import { API_ROUTES } from "@/lib/API_ROUTES";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfintiteCommentsData } from "../types/InfiniteCommentData";
import useUserId from "@/hooks/useUserId";
import { api } from "@/lib/axios";
import { produce } from "immer";

type LikeCommentResponse = {
  data: {
    like: {
      id: string;
      authorId: string;
      commentId: string;
    };
  };
};

const useLikeCommentMutation = (
  postId: string,
  commentId: string,
  commentAuthorId: string,
  postAuthorId: string,
) => {
  const authenticatedUserId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["likeComment", commentId],
    mutationFn: async (commentId: string) => {
      const res = await api.post<LikeCommentResponse>(
        `${API_ROUTES.POST_SERVICE}/comment/${commentId}/like`,
      );
      return res.data.data;
    },
    onSuccess: (responseData) => {
      queryClient.setQueryData(["comments", postId], (oldData: InfintiteCommentsData) => {
        if (!oldData) return oldData;

        const newPages: NonNullable<InfintiteCommentsData>["pages"] = oldData.pages
          ? produce(oldData.pages, (draftPage) => {
              draftPage.forEach((page) =>
                page.comments.forEach((comment) => {
                  if (comment.id === responseData.like.commentId) {
                    if (typeof comment.likeCount === "number" && !comment.hasLikedByUser) {
                      comment.likeCount++;
                    }
                    if (authenticatedUserId === responseData.like.authorId) {
                      comment.hasLikedByUser = true;
                    }

                    if (
                      authenticatedUserId === postAuthorId &&
                      postAuthorId === responseData.like.authorId &&
                      commentAuthorId !== postAuthorId
                    ) {
                      comment.likedByPostAuthor = true;
                    }
                  }
                }),
              );
            })
          : [];

        return { pageParams: oldData.pageParams, pages: newPages } as InfintiteCommentsData;
      });
    },
  });
};

export default useLikeCommentMutation;
