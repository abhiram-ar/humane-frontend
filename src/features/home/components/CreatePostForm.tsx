import ButtonPop from "@/components/ButtonPop";
import { SpinnerBlack } from "@/components/Spinner";
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
import PosterImage from "./PosterImage";
import { CreatePostFields, createPostSchema } from "../types/CreatePostFields";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import CreatePostTextareaWithHashtagAutoCompletetion from "./CreatePostTextareaWithHashtagAutoCompletetion";

type Props = {
  handleCreatePost(data: CreatePostFields): Promise<void>;
};
const CreatePostForm: React.FC<Props> = ({ handleCreatePost }) => {
  const [posterPreview, setPosterPreview] = useState<{
    type: string;
    url: string;
  } | null>(null);
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
      setPosterPreview({ type: file.type, url: URL.createObjectURL(file) });
    } else {
      setPosterPreview(null);
    }
  };

  const handleRemovePoster = () => {
    setPosterPreview(null);
    setValue("poster", null);
  };

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

          <CreatePostTextareaWithHashtagAutoCompletetion register={register} setValue={setValue} />
        </div>

        {/* react hook form has a ref on input for we want to avoid over riding it */}
        <div ref={fileInputContainerRef}>
          <input
            type="file"
            className="hidden"
            {...register("poster")}
            accept="image/*,video/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              register("poster").onChange(e);
              register("poster");
              handleFileChange(e);
            }}
          />
        </div>

        {posterPreview && posterPreview.type.toLowerCase().startsWith("image") && (
          <div className="flex w-full">
            <div className="relative w-fit">
              <div className="bg-offwhite hover:text-offwhite absolute top-1 right-1 z-10 cursor-pointer rounded-full border border-zinc-800/50 p-0.5 text-red-500 hover:bg-red-500">
                <X size={20} onClick={() => handleRemovePoster()} />
              </div>

              <PosterImage className="max-h-100" url={posterPreview.url} />
            </div>
          </div>
        )}

        {posterPreview && posterPreview.type.toLowerCase().startsWith("video") && (
          <div className="flex w-full">
            <div className="relative w-fit">
              <div className="bg-offwhite hover:text-offwhite absolute top-1 right-1 z-50 cursor-pointer rounded-full border border-zinc-800/50 p-0.5 text-red-500 hover:bg-red-500">
                <X size={20} onClick={() => handleRemovePoster()} />
              </div>

              <VideoPlayer src={posterPreview.url} autoplay={false} mimeType={posterPreview.type} />
            </div>
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
              <p>Add Photo / Video</p>
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
            {!isSubmitting ? <span>Post</span> : <SpinnerBlack className="flex justify-center" />}
          </ButtonPop>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
