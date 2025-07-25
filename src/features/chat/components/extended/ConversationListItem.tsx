import ProfilePicSmall from "@/components/ProfilePicSmall";
import { CheckCheck } from "lucide-react";
import React, { ComponentPropsWithoutRef } from "react";
import useUserId from "@/hooks/useUserId";
import { ConversationWithLastMessage } from "../../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";

type Props = {
  convo: ConversationWithLastMessage & { otherUser?: BasicUserDetails };
} & ComponentPropsWithoutRef<"div">;
const ConversationListItem: React.FC<Props> = ({ convo, className }) => {
  const currentUserId = useUserId();
  return (
    <div className={`mb-2 flex h-fit cursor-pointer gap-3 ${className}`}>
      <div className="size-10 min-w-10 overflow-hidden rounded-full">
        <ProfilePicSmall avatarURL={convo.otherUser?.avatarURL} />
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="">
          <p className="text-base">
            {convo.otherUser
              ? `${convo.otherUser.firstName} ${convo.otherUser.lastName || ""}`
              : "Humane user"}
          </p>
          <p className="flex items-center text-sm text-zinc-400">
            {/* only for groups: display the author of last message */}
            {convo.type === "group" && convo.lastMessage?.senderId === currentUserId ? "you:" : ""}

            {convo.lastMessage && (
              <>
                {" "}
                {convo.lastMessage.senderId === currentUserId && (
                  <CheckCheck className="text-pop-green/70 me-1" size={18} />
                )}
                <span className="inline-block max-w-60 truncate overflow-hidden align-middle text-ellipsis">
                  {convo.lastMessage.message}
                </span>
              </>
            )}
          </p>
        </div>
        {convo.unreadCount > 0 && (
          <p className="bg-pop-green/90 size-fit rounded-full p-0.5 px-1.5 text-center align-middle text-xs text-black">
            {convo.unreadCount}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationListItem;
