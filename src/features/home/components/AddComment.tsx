import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import useAddCommentMutation from "../hooks/useAddCommentMutation";
import { commentFields, commentSchema } from "../types/createCommentFields";

const AddComment: React.FC<{ postId: string }> = ({ postId }) => {
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
    <div className="group w-full">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex items-center justify-between gap-3"
      >
        <input
          type="text"
          {...register("content")}
          placeholder="Add a comment "
          className={`w-full rounded-xl border-none px-4 py-1 transition-colors duration-200 ease-out outline-none focus:bg-zinc-400/20 ${isValid ? "bg-zinc-400/20" : ""}`}
        />
        {/* <ButtonPop className="h-fit ">Comment</ButtonPop> */}
        <button
          disabled={!isValid || isSubmitting}
          className={`text-pop-green h-fit cursor-pointer ${!isValid ? "opacity-0" : "opacity-100"}`}
        >
          Comment
        </button>
      </form>
    </div>
  );
};

export default AddComment;
