import React from "react";
import useAddCommentMutation from "../hooks/useAddCommentMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentFields, commentSchema } from "../types/createCommentFields";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonPop from "@/components/ButtonPop";
import { useQueryClient } from "@tanstack/react-query";
import { AuthorHydratedComment } from "../types/GetPostComments.types";
import { produce } from "immer";
import useCurrentUserProfile from "@/features/profile/hooks/useCurrentUserProfile";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import useUserId from "@/hooks/useUserId";
import { InfintiteCommentsData } from "../types/InfiniteCommentData";

const PostAddCommentForm: React.FC<{ postId?: string }> = ({ postId }) => {
  const { mutateAsync } = useAddCommentMutation();
  const queryClinet = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const userId = useUserId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(commentSchema) });

  const submitHandler: SubmitHandler<commentFields> = async (data) => {
    await mutateAsync(
      { content: data.content, postId: postId as string },
      {
        onSuccess: (responseData) => {
          queryClinet.setQueryData(
            ["comments", responseData.postId],
            (oldData: InfintiteCommentsData) => {
              if (!oldData) return oldData;

              const authorDetails: BasicUserDetails = {
                id: userId as string,
                firstName: currentUser?.firstName ?? "You",
                avatarURL: currentUser?.avatarURL ?? null,
              };

              const newHydratedComm: AuthorHydratedComment = {
                ...responseData,
                author: { ...authorDetails },
              };

              const newPages = produce(oldData.pages, (draft) => {
                draft[0].comments.unshift(newHydratedComm);
              });

              return { pageParams: oldData.pageParams, pages: newPages } as InfintiteCommentsData;
            },
          );
        },
      },
    );
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex w-full items-center justify-between gap-3"
    >
      <input
        type="text "
        {...register("content")}
        placeholder="write a comment"
        disabled={!postId}
        className={`w-full rounded-xl border-none px-4 py-1 font-semibold text-white outline-none placeholder:font-normal disabled:cursor-not-allowed`}
      />
      {/* <ButtonPop className="h-fit ">Comment</ButtonPop> */}
      <ButtonPop disabled={!isValid || isSubmitting}>Comment</ButtonPop>
    </form>
  );
};

export default PostAddCommentForm;
