import ButtonPop from "@/components/ButtonPop";
import Spinner, { SpinnerBlack } from "@/components/Spinner";
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
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { useQuery } from "@tanstack/react-query";

// const suggestions = ["hello", "world", "now"];

type HashtagWithCount = { name: string; count: number };

type HashTagSearchResponse = {
  data: {
    hashtags: HashtagWithCount[];
  };
};

type Props = {
  handleCreatePost(data: CreatePostFields): Promise<void>;
};
const CreatePostForm: React.FC<Props> = ({ handleCreatePost }) => {
  const [posterPreview, setPosterPreview] = useState<{
    type: string;
    url: string;
  } | null>(null);
  const fileInputContainerRef = useRef<HTMLDivElement | null>(null);
  const contentTextInputRef = useRef<HTMLTextAreaElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTag, setSearchTag] = useState("");

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

  const fetchSuggestions = async () => {
    const res = await api.get<HashTagSearchResponse>(`${API_ROUTES.WRITER_ROUTE}/hashtag`, {
      params: { query: searchTag, limit: 5 },
    });
    return res.data.data.hashtags;
  };

  const { data: suggestions, isFetching } = useQuery({
    queryKey: [searchTag],
    queryFn: fetchSuggestions,
    enabled: searchTag.length > 1,
  });

  const syncMirror = () => {
    if (!contentTextInputRef.current || !mirrorRef.current) return;

    const text = contentTextInputRef.current.value;
    const cursorPos = contentTextInputRef.current.selectionStart;

    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);

    // insert marker span for cursor
    mirrorRef.current.innerHTML =
      beforeCursor.replace(/\n/g, "<br/>") +
      '<span id="caret-marker">|</span>' +
      afterCursor.replace(/\n/g, "<br/>");

    const caret = mirrorRef.current.querySelector("#caret-marker");
    if (caret) {
      const rect = caret.getBoundingClientRect();
      const containerRect = mirrorRef.current.getBoundingClientRect();

      setDropdownPos({
        top: rect.top - containerRect.top + 20, // adjust for line height
        left: rect.left - containerRect.left,
      });
    }
  };

  const insertHashtag = (tag: string) => {
    const textarea = contentTextInputRef.current;
    if (!textarea) return;

    const content = textarea.value;
    const cursorPos = textarea.selectionStart;

    const textBefore = content.slice(0, cursorPos).replace(/#\w*$/, `#${tag} `);
    const textAfter = content.slice(cursorPos); // handling cases where user comebase and insert a hashtag, this will be empty incase of cursor is at last character

    const newContent = textBefore + textAfter;

    setValue("content", newContent);
    setShowSuggestions(false);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = textBefore.length;
    }, 0);
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    const cursorPos = e.target.selectionStart;
    syncMirror();

    const textBeforeCursor = content.slice(0, cursorPos);

    const match = textBeforeCursor.match(/#(\w*)$/);

    if (match) {
      const currentTag = match[1];
      setSearchTag(currentTag);
      if (currentTag.length > 1) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setSearchTag("");
    }

    // Update form state
    setValue("content", content);
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

          <textarea
            id="post-content"
            {...register("content")}
            onChange={(e) => {
              register("content").onChange(e);
              handleTextChange(e);
            }}
            rows={4}
            placeholder="Whats in your mind?"
            className="bg-grey-light row-auto w-full resize-none auto-cols-min rounded-lg p-2 px-3 outline-1 focus:outline-2 focus:outline-zinc-400/50"
            ref={(el) => {
              register("content").ref(el);
              contentTextInputRef.current = el;
              // Attach ref for cursor position if
            }}
          />

          {/* Hidden Mirror Div */}
          <div
            ref={mirrorRef}
            className="pointer-events-none invisible absolute top-0 left-0 w-full p-2 px-3 break-words whitespace-pre-wrap"
            aria-hidden="true"
          />

          {/* Suggestion Dropdown */}
          {showSuggestions && (
            <div
              className="bg-grey absolute z-10 min-w-10 rounded-md shadow-md"
              style={{ top: dropdownPos.top, left: dropdownPos.left }}
            >
              {isFetching && <Spinner />}
              {suggestions &&
                suggestions.length > 0 &&
                suggestions.map((tag) => (
                  <div
                    key={tag.name}
                    className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-400/50"
                    onClick={() => insertHashtag(tag.name)}
                  >
                    #{tag.name}
                  </div>
                ))}

              {suggestions && suggestions.length === 0 && (
                <p
                  className="cursor-pointer rounded-md p-2 text-sm hover:bg-gray-400/50"
                  onClick={() => insertHashtag(searchTag)}
                >
                  Add hashtag
                </p>
              )}
            </div>
          )}
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
