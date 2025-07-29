import { format } from "date-fns";
import { CheckCheck, CircleX, Clock, Trash2 } from "lucide-react";
import React from "react";
import { Message } from "../../Types/Message";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import ViewPicture from "@/features/profile/components/base/ViewPicture";
import ChatImageAttachment from "./ChatImageAttachment";

type Props = {
  message: Message;
  onDeleteClick(message: Message): Promise<void>;
  onRetryClick(message: Message): Promise<void>;
};

const UserMessage: React.FC<Props> = ({ message, onDeleteClick, onRetryClick }) => {
  const timeString = format(message.sendAt, "hh:mm a - dd MMM");
  return (
    <div className="group mb-1 flex w-full">
      {/* options */}
      <div className="flex w-full items-center justify-end text-white">
        {!message.sendStatus && !message.status?.deleted && (
          <div className="translate-y-5 scale-50 cursor-pointer opacity-0 transition-all delay-0 duration-100 ease-in group-hover:block group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-500 group-hover:ease-out">
            <div
              onClick={() => onDeleteClick(message)}
              className="mx-2 rounded-full p-2 hover:bg-zinc-400/50"
            >
              <Trash2 size={20} />
            </div>
          </div>
        )}
      </div>

      {/* message itself */}
      <div className="bg-green-subtle/95 group-hover:bg-green-subtle relative me-2 max-w-3/5 min-w-30 rounded-t-lg rounded-bl-lg p-2 pb-5">
        {message.attachment &&
          message.attachment.attachmentType?.startsWith("image/") &&
          message.attachment.attachmentURL && (
            <div className="flex w-full pb-2">
              <div className="relative h-30 w-full xl:h-50">
                <ViewPicture src={message.attachment.attachmentURL}>
                  <ChatImageAttachment
                    className="cursor-pointer border border-zinc-400/50 bg-zinc-400/10"
                    url={message.attachment.attachmentURL}
                  />
                </ViewPicture>
              </div>
            </div>
          )}

        {message.attachment &&
          message.attachment.attachmentType?.toLowerCase().startsWith("video") &&
          message.attachment.attachmentURL && (
            <div className="flex w-full">
              <div className="relative w-120">
                <VideoPlayer
                  src={message.attachment.attachmentURL}
                  autoplay={false}
                  mimeType={message.attachment.attachmentType}
                />
              </div>
            </div>
          )}
        {!message.status?.deleted ? (
          <p>{message.message}</p>
        ) : (
          <p className="text-sm text-zinc-600 italic">message deleted</p>
        )}

        {/* medtadata */}
        <div className="absolute right-1 bottom-1 flex w-fit items-center gap-1 text-xs text-zinc-500">
          <p>{timeString}</p>

          {message.sendStatus && message.sendStatus === "pending" && <Clock size={13} />}

          {!message.sendStatus && !message.status?.deleted && (
            <CheckCheck className="text-green-800" size={13} />
          )}
        </div>
      </div>
      {message.sendStatus && message.sendStatus === "error" && (
        <div className="group relative flex flex-col justify-end pe-1">
          <p
            onClick={() => onRetryClick(message)}
            className="absolute top-2 right-1 cursor-pointer rounded-md border border-black bg-red-400 px-3 py-0.5 text-black opacity-0 group-hover:opacity-100"
          >
            Retry
          </p>
          <CircleX className="fill-red-400" size={20} />
        </div>
      )}
    </div>
  );
};

export default UserMessage;
