import { useQuery } from "@tanstack/react-query";
import { HydratedPost } from "../types/GetPostsReponse";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";

export type GetFullPostDetailsResponse = {
  message: string;
  data: {
    post: HydratedPost;
  };
};

const useFullPostDetailsQuery = (postId: string, initialPostData?: HydratedPost) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await api.get<GetFullPostDetailsResponse>(
        `${API_ROUTES.QUERY_SERVICE}/post/${postId}`,
      );
      return res.data.data;
    },
    initialData: initialPostData ? { post: initialPostData as HydratedPost } : undefined,
    retry: 0,
  });
};

export default useFullPostDetailsQuery;
