import React from "react";
import { Message } from "../../Types/Message";
import { format } from "date-fns";
import ViewPicture from "@/features/profile/components/base/ViewPicture";
import PosterImage from "@/features/home/components/PosterImage";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";

type Props = {
  message: Message;
};

const OtherParticipantMessage: React.FC<Props> = ({ message }) => {
  const timeString = format(message.sendAt, "hh:mm a - dd MMM");
  return (
    <div className="mb-1 flex w-full">
      {/* message itself */}
      <div className="relative ms-2 max-w-3/5 min-w-35 rounded-t-lg rounded-br-lg bg-pink-200/95 p-2 pb-5 outline-none hover:bg-pink-200">
        {message.attachment &&
          message.attachment.attachmentType?.startsWith("image/") &&
          message.attachment.attachmentURL && (
            <div className="flex w-full pb-2">
              <div className="relative w-fit">
                <ViewPicture src={message.attachment.attachmentURL} title={""}>
                  <PosterImage
                    className="!max-h-80 !w-full cursor-pointer border border-zinc-400/50 bg-zinc-400/10"
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
              <div className="relative w-fit">
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
        <div className="absolute right-2 bottom-1 flex w-fit items-center gap-1 text-xs text-zinc-500">
          <p>{timeString}</p>
        </div>
      </div>

      {/* options */}
      <div className="w-full"></div>
    </div>
  );
};

export default OtherParticipantMessage;
