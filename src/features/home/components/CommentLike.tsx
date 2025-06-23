import { Heart } from "lucide-react";
import React from "react";
import useLikeCommentMutation from "../hooks/useLikeCommentMutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { InfintiteCommentsData } from "../types/InfiniteCommentData";
import { produce } from "immer";
import useUserId from "@/features/profile/hooks/useUserId";

type Props = {
  postId: string;
  commentId: string;
  likeCount?: number;
  hasLikedByUser?: boolean;
  hasPostAuthorLiked?: boolean;
};

type UnlikeCommentResponse = {
  data: {
    like: {
      id: string;
      authorId: string;
      commentId: string;
    };
  };
};

const CommentLike: React.FC<Props> = ({ likeCount, hasLikedByUser, commentId, postId }) => {
  const { mutate: likeComment } = useLikeCommentMutation(postId, commentId);
  const queryClient = useQueryClient();
  const authenticatedUserId = useUserId();

  const { mutate: unlikeComment } = useMutation({
    mutationKey: ["unlikeComment", commentId],
    mutationFn: async (commentId: string) => {
      const res = await api.post<UnlikeCommentResponse>(
        `${API_ROUTES.POST_SERVICE}/comment/${commentId}/unlike`,
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
                    if (typeof comment.likeCount === "number" && comment.hasLikedByUser) {
                      comment.likeCount--;
                    }
                    if (authenticatedUserId === responseData.like.authorId) {
                      comment.hasLikedByUser = false;
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

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div
        className="cursor-pointer rounded-full p-1 hover:bg-zinc-400/50"
        onClick={() => (hasLikedByUser ? unlikeComment(commentId) : likeComment(commentId))}
      >
        <Heart
          size={15}
          className={`text-white ${hasLikedByUser ? "stroke-red-blood fill-red-500" : ""}`}
        />
      </div>
      <div className={`text-sm text-zinc-400 ${!likeCount ? "opacity-0" : ""}`}>
        {likeCount && likeCount}
      </div>
    </div>
  );
};

export default CommentLike;
