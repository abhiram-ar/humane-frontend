import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type CreateCommentResponse = {
  message: string;
  data: {
    comment: {
      id: string;
      createdAt: string;
      updatedAt: string;
      authorId: string;
      postId: string;
      content: string;
    };
  };
};

const useAddCommentMutation = () => {
  return useMutation({
    mutationFn: async (data: { content: string; postId: string }) => {
      const res = await api.post<CreateCommentResponse>(
        `${API_ROUTES.POST_SERVICE}/${data.postId}/comment/`,
        {
          content: data.content,
        },
      );
      return res.data.data.comment;
    },
  });
};

export default useAddCommentMutation;
