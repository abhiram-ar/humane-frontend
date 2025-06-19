import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import useUserId from "./useUserId";
import { GetUserPostTimelineResponse } from "../Types/GetUserTimelineResponse";
import { api } from "@/lib/axios";
import { ModerationStatus, PostVisibility } from "humane-common";
import { API_ROUTES } from "@/lib/API_ROUTES";

type DeletePostResponse = {
  message: "post deleted";
  data: {
    post: {
      id: string;
      createdAt: string;
      updatedAt: string;
      authorId: string;
      content: string;
      visibility: (typeof PostVisibility)[keyof typeof PostVisibility];
      posterKey: string | null;
      moderationStatus: (typeof ModerationStatus)[keyof typeof ModerationStatus];
      moderationMetadata: unknown | null;
    };
  };
};

const useDeleteUserPost = (postId: string) => {
  const userId = useUserId();
  const queryClient = useQueryClient();
  type InfiniteTimelineData =
    | InfiniteData<GetUserPostTimelineResponse["data"], unknown>
    | undefined;

  return useMutation({
    mutationKey: ["user-post", postId],
    mutationFn: async () => {
      const res = await api.delete<DeletePostResponse>(`${API_ROUTES.POST_SERVICE}/${postId}`);
      return res.data.data;
    },
    onSuccess: (responseData) => {
      queryClient.setQueryData(["timeline", userId], (oldData: InfiniteTimelineData) => {
        if (!oldData) return oldData;
        //   return page.

        const newPagesArray = oldData.pages
          ? oldData.pages.map((page) => ({
              ...page,
              posts: page.posts
                .map((post) => post)
                .filter(
                  (post) => post.id !== responseData.post.id,
                ) as GetUserPostTimelineResponse["data"]["posts"],
            }))
          : oldData.pages;

        const update: InfiniteTimelineData = {
          pageParams: oldData.pageParams,
          pages: newPagesArray,
        };

        return update;
      });
    },
  });
};

export default useDeleteUserPost;
