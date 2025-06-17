import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCommentResponse } from "../types/DeleteCommentResponse";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { InfintiteCommentsData } from "../types/InfiniteCommentData";

const useDeleteCommentMutation = (commentId: string, postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete", "comment", commentId],
    mutationFn: async ({ commentId, postId }: { commentId: string; postId: string }) => {
      const res = await api.delete<DeleteCommentResponse>(
        `${API_ROUTES.POST_SERVICE}/${postId}/comment/${commentId}`,
      );
      return res.data.data;
    },
    onSuccess: (deletedResponse) => {
      queryClient.setQueryData(["comments", postId], (oldData: InfintiteCommentsData) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages
          ? oldData.pages.map((page) => {
              const comments = page.comments.filter(
                (comment) => comment.id !== deletedResponse.comment.id,
              );

              return { ...page, comments: comments };
            })
          : [];

        return { pageParams: oldData.pageParams, pages: newPages } as InfintiteCommentsData;
      });
    },
  });
};

export default useDeleteCommentMutation;
