import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import useAddCommentMutation from "../hooks/useAddCommentMutation";
import { commentFields, commentSchema } from "../types/createCommentFields";
import useIncrementFeedPostCommentCount from "../hooks/useIncrementFeedPostCommentCount";
import { useLocation, useParams } from "react-router";
import useIncrementTimelinePostCommentCount from "@/features/profile/hooks/useIncrementUserTimelinePostCommentCount";
import useUserId from "@/features/profile/hooks/useUserId";

const FeedAddCommentForm: React.FC<{ postId: string }> = ({ postId }) => {
  const { mutateAsync } = useAddCommentMutation();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const authenticatedUser = useUserId();

  const { incrementFeedPostCommentCount } = useIncrementFeedPostCommentCount();

  // if the postIf from userHome timeline update that
  const { incrementTimelinePostCommentCount } = useIncrementTimelinePostCommentCount(
    id ?? (authenticatedUser as string),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(commentSchema) });

  const submitHandler: SubmitHandler<commentFields> = async (data) => {
    await mutateAsync(
      { content: data.content, postId: postId },
      {
        onSuccess: () => {
          reset();
          if (location.pathname === "/") {
            incrementFeedPostCommentCount(postId);
          } else {
            incrementTimelinePostCommentCount(postId);
          }
        },
      },
    );
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
          className={`h-fit cursor-pointer disabled:cursor-not-allowed disabled:text-zinc-400 ${!isValid ? "opacity-0" : "text-pop-green opacity-100"} `}
        >
          Comment
        </button>
      </form>
    </div>
  );
};

export default FeedAddCommentForm;
