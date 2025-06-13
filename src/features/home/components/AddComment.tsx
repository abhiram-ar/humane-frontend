import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type CreateCommentResponse = {
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

const commentSchema = z.object({ content: z.string().trim().nonempty() });
type commentFields = z.infer<typeof commentSchema>;

const AddComment: React.FC<{ postId: string }> = ({ postId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({ resolver: zodResolver(commentSchema) });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: { content: string; postId: string }) => {
      const res = await api.post<CreateCommentResponse>(`/api/v1/post/${data.postId}/comment/`, {
        content: data.content,
      });
      return res.data.data.comment;
    },
  });

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
