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
      const res = await api.post<CreateCommentResponse>(`/api/v1/post/${data.postId}/comment/`, {
        content: data.content,
      });
      return res.data.data.comment;
    },
  });
};

export default useAddCommentMutation;
