import ProfilePicSmall from "@/components/ProfilePicSmall";
import { CheckCheck } from "lucide-react";
import React, { ComponentPropsWithoutRef } from "react";

type Props = {
  profileURL: string | null | undefined;
  userName: string;
  type: "one-to-one" | "gropu";
  lastMessage: {
    senderId: string;
    isRead: boolean;
    message: string;
  };
  unreadCount: number;
} & ComponentPropsWithoutRef<"div">;
const ConversationListItem: React.FC<Props> = ({
  profileURL,
  userName,
  className,
  lastMessage,
  type,
  unreadCount = 89,
}) => {
  return (
    <div className={`mb-2 flex h-fit cursor-pointer gap-3 ${className}`}>
      <div className="size-10 overflow-hidden rounded-full">
        <ProfilePicSmall avatarURL={profileURL} />
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="">
          <p className="text-base">{userName}</p>
          <p className="flex items-center text-sm text-zinc-400">
            {/* only for groups: display the author of last message */}
            {type === "gropu" && Number(lastMessage.senderId) % 2 === 0 ? "you:" : ""}

            {Number(lastMessage.senderId) % 2 === 0 && (
              <CheckCheck className="text-pop-green/70 me-1" size={18} />
            )}
            <span className="inline-block max-w-60 truncate overflow-hidden align-middle text-ellipsis">
              {lastMessage.message}
            </span>
          </p>
        </div>
        {unreadCount > 0 && (
          <p className="bg-pop-green/90 size-fit rounded-full p-0.5 px-1.5 text-center align-middle text-xs text-black">
            {unreadCount}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationListItem;
