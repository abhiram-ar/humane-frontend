import React from "react";
import useAddCommentMutation from "../hooks/useAddCommentMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentFields, commentSchema } from "../types/createCommentFields";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonPop from "@/components/ButtonPop";

const PostAddCommentForm: React.FC<{ postId: string }> = ({ postId }) => {
  const { mutateAsync } = useAddCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(commentSchema) });

  const submitHandler: SubmitHandler<commentFields> = async (data) => {
    await mutateAsync({ content: data.content, postId: postId });
    reset();
    // TODO: mutate the curresponsing post comments count in timeline
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
        className={`w-full rounded-xl border-none px-4 py-1 font-semibold text-white outline-none placeholder:font-normal`}
      />
      {/* <ButtonPop className="h-fit ">Comment</ButtonPop> */}
      <ButtonPop disabled={!isValid || isSubmitting}>Comment</ButtonPop>
    </form>
  );
};

export default PostAddCommentForm;
