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
import { Earth, Heart, ImagePlus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import z from "zod";
import PosterImage from "./PosterImage";

const createPostSchema = z.object({
  content: z.string().trim().nonempty("Cannot be empty").max(256, "max 256 chars"),
  visibility: z.enum(["friends", "public"]),
  poster: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.length === 0 || file[0]?.type?.startsWith("image/"),
      "File must be an image",
    )
    .refine(
      (file) => !file || file.length === 0 || file[0]?.size <= 5 * 1024 * 1024,
      "Max file size is 5MB",
    ),
});

export type CreatePostFields = z.infer<typeof createPostSchema>;
type Props = {
  handleCreatePost(data: CreatePostFields): Promise<void>;
};

const CreatePostForm: React.FC<Props> = ({ handleCreatePost }) => {
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileInputContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    setValue,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const file = e.target.files?.[0];
    if (file) {
      setPosterPreview(URL.createObjectURL(file));
    } else {
      setPosterPreview(null);
    }
  };

  const handleRemovePoster = () => {
    setPosterPreview(null);
    setValue("poster", null);
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
            rows={4}
            placeholder="Whats in your mind?"
            className="bg-grey-light row-auto w-full resize-none auto-cols-min rounded-lg p-2 px-3 outline-1 focus:outline-2 focus:outline-zinc-400/50"
          />
        </div>

        {/* react hook form has a ref on input for we want to avoid over riding it */}
        <div ref={fileInputContainerRef}>
          <input
            type="file"
            className="hidden"
            {...register("poster")}
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              register("poster").onChange(e);
              register("poster");
              handleFileChange(e);
            }}
          />
        </div>

        {posterPreview && (
          <div className="relative">
            <div className="absolute top-1 right-1 cursor-pointer rounded-full bg-zinc-300 p-0.5 text-red-500 hover:bg-red-500 hover:text-zinc-300">
              <X size={20} onClick={() => handleRemovePoster()} />
            </div>

            <PosterImage className="max-h-100" url={posterPreview} />
          </div>
        )}

        <div className="mt-5 -mb-5 flex items-center justify-end gap-3">
          {!posterPreview && (
            <div
              onClick={() =>
                (fileInputContainerRef.current?.children[0] as HTMLInputElement).click()
              }
              className="bg-grey-light/50 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-400/20 px-5 py-1 text-white"
            >
              <ImagePlus size={20} />
              <p>Add Photo</p>
            </div>
          )}

          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="item-center bg-grey-light/50 flex rounded-full border border-zinc-400/20">
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

          <ButtonPop
            className="h-fit w-25 py-1.25 disabled:bg-zinc-400"
            disabled={(errors && Object.keys(errors).length > 0) || isSubmitting}
          >
            {!isSubmitting ? (
              <span>Post</span>
            ) : (
              <Spinner spinnerColor="black" className="flex h-8 justify-center" />
            )}
          </ButtonPop>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
