import { format } from "date-fns";
import { CheckCheck, CircleX, Clock } from "lucide-react";
import React from "react";
import { Message } from "../../Types/Message";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import ViewPicture from "@/features/profile/components/base/ViewPicture";
import ChatImageAttachment from "./ChatImageAttachment";

type Props = {
  message: Message;
};

const UserMessage: React.FC<Props> = ({ message }) => {
  const timeString = format(message.sendAt, "hh:mm a - dd MMM");
  return (
    <div className="mb-1 flex w-full">
      {/* options */}
      <div className="w-full"></div>

      {/* message itself */}
      <div className="bg-green-subtle/95 hover:bg-green-subtle relative me-2 min-w-30 rounded-t-lg rounded-bl-lg p-2 pb-5 max-w-3/5">
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
        <p>{message.message}</p>

        {/* medtadata */}
        <div className="absolute right-1 bottom-1 flex w-fit items-center gap-1 text-xs text-zinc-500">
          <p>{timeString}</p>

          {message.sendStatus && message.sendStatus === "pending" && <Clock size={13} />}
          {message.sendStatus && message.sendStatus === "error" && (
            <CircleX className="fill-red-400" size={13} />
          )}

          {!message.sendStatus && <CheckCheck className="text-green-800" size={13} />}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
