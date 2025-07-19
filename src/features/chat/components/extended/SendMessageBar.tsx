import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import PosterImage from "@/features/home/components/PosterImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerRightUp, Plus, Repeat2, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateMessageFields, createMessageSchema } from "../../Types/CreateMessageFields";

type Props = {
  handleOnSubmit: (data: CreateMessageFields) => void;
};

const SendMessageBar: React.FC<Props> = ({ handleOnSubmit }) => {
  const attachmentFileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: zodResolver(createMessageSchema) });

  const [attachment, setAttachment] = useState<globalThis.File | null>(getValues("attachment"));
  const [attachmentURL, setAttachmentURL] = useState<string | null>(
    attachment ? URL.createObjectURL(attachment) : null,
  );

  const handleOnAttachmentclick = () => {
    attachmentFileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setAttachmentURL(URL.createObjectURL(file));
    } else {
      setAttachment(null);
      if (attachmentURL) {
        URL.revokeObjectURL(attachmentURL);
      }
      setAttachmentURL(null);
    }
  };

  const handleRemovePoster = () => {
    // when we invoke URL.createURL from object,
    // a new object is created even when we have a object. And it wont be GC untill we revoke it or document is closed
    if (attachmentURL) {
      URL.revokeObjectURL(attachmentURL);
      setAttachmentURL(null);
    }
    setAttachment(null);
    setValue("attachment", null);
    clearErrors("attachment");
  };

  return (
    <div className="relative min-h-16 w-full rounded-t-3xl border border-zinc-400/50 bg-zinc-600/50 p-2 backdrop-blur-sm focus-within:bg-zinc-600/90">
      {attachment && attachment.type.startsWith("image/") && attachmentURL && (
        <div className="flex w-full pb-2">
          <div className="relative w-fit">
            <div className="bg-offwhite hover:text-offwhite absolute top-1 right-1 z-10 cursor-pointer rounded-full border border-zinc-800/50 p-0.5 text-red-500 hover:bg-red-500">
              <X size={20} onClick={() => handleRemovePoster()} />
            </div>

            <PosterImage
              className="size-50 !max-h-50 border border-zinc-400/50 bg-zinc-400/10"
              url={attachmentURL}
            />
          </div>
        </div>
      )}

      {attachment && attachment.type.toLowerCase().startsWith("video") && attachmentURL && (
        <div className="flex w-full">
          <div className="relative w-fit">
            <div className="bg-offwhite hover:text-offwhite absolute top-1 right-1 z-50 cursor-pointer rounded-full border border-zinc-800/50 p-0.5 text-red-500 hover:bg-red-500">
              <X size={20} onClick={() => handleRemovePoster()} />
            </div>

            <VideoPlayer
              src={URL.createObjectURL(attachment)}
              autoplay={false}
              mimeType={attachment.type}
            />
          </div>
        </div>
      )}
      {attachment && errors.attachment && (
        <p className="text-center font-normal text-red-500">
          ({errors.attachment.message?.toString()})
        </p>
      )}

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex items-baseline justify-between gap-2"
      >
        <div
          onClick={handleOnAttachmentclick}
          className="flex size-10 min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full text-white hover:bg-zinc-400/50"
        >
          {attachment ? <Repeat2 size={20} /> : <Plus size={20} />}

          <input
            type="file"
            className="hidden"
            {...register("attachment")}
            defaultValue={undefined}
            accept="image/*,video/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              register("attachment").onChange(e);
              handleFileChange(e);
            }}
            ref={(el) => {
              register("attachment").ref(el);
              attachmentFileInputRef.current = el;
            }}
          />
        </div>

        <div className="w-full px-2">
          <textarea
            rows={1}
            {...register("message")}
            className="max-h-30 w-full resize-none text-white outline-0"
            id="message-input"
            style={{ overflow: "hidden" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>
        <button
          disabled={Object.entries(errors).length > 0}
          className="bg-pop-green/90 hover:bg-pop-green flex size-10 min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full disabled:bg-zinc-400"
        >
          <CornerRightUp size={20} />
        </button>
      </form>
    </div>
  );
};

export default SendMessageBar;
