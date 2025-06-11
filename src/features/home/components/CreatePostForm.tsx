import ButtonPop from "@/components/ButtonPop";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ServerErrors } from "@/types/serverErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Earth, Heart } from "lucide-react";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import z from "zod";

const createPostSchema = z.object({
  content: z.string().trim().nonempty("Cannot be empty").max(256, "max 256 chars"),
  visibility: z.enum(["friends", "public"]),
});

export type CreatePostFields = z.infer<typeof createPostSchema>;
type Props = {
  handleCreatePost(data: CreatePostFields): Promise<void>;
};

const CreatePostForm: React.FC<Props> = ({ handleCreatePost }) => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    register,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: { visibility: "friends" },
  });

  const submitHandler: SubmitHandler<CreatePostFields> = async (data) => {
    try {
      await handleCreatePost(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        const serializedErrors = error.response.data.errors as ServerErrors;
        serializedErrors
          .filter((err) => err.field && Object.keys(data).includes(err.field))
          .map((err) =>
            setError(err.field as keyof typeof data, { message: err.message, type: "server" }),
          );
      } else console.log(error);
    }
  };
  console.log("error", errors);
  return (
    <div className="text-white">
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="relative">
          <label
            htmlFor="post-content"
            className="text-offwhite absolute -top-6 right-0 flex items-baseline gap-2 text-sm font-semibold"
          >
            {errors.content && (
              <p className="font-normal text-red-500">({errors.content.message})</p>
            )}
          </label>
          <textarea
            id="post-content"
            {...register("content")}
            rows={5}
            placeholder="Whats in your mind?"
            className="bg-grey-light row-auto w-full resize-none auto-cols-min rounded-md p-2 px-3 outline-1 focus:outline-2 focus:outline-zinc-400/50"
          />
        </div>
        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="item-center bg-grey-light/50 mt-1 flex border border-zinc-400/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                defaultValue={"friends"}
                className="bg-grey-light border border-zinc-400/50 text-white"
              >
                <SelectGroup>
                  <SelectLabel className="text-zinccretePostSchema00">Visibility</SelectLabel>
                  <SelectItem value="friends">
                    <Heart color="white" />
                    Friends
                  </SelectItem>
                  <SelectItem value="public">
                    <Earth color="white" />
                    Public
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <div className="flex justify-end">
          <ButtonPop
            className="disabled:bg-zinc-400"
            disabled={(errors && Object.keys(errors).length > 0) || isSubmitting}
          >
            {!isSubmitting ? (
              <span>Post</span>
            ) : (
              <Spinner spinnerColor="black" className="flex h-6 w-8 justify-center" />
            )}
          </ButtonPop>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
