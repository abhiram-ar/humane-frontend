import ProfilePicSmall from "@/components/ProfilePicSmall";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import useUserId from "@/hooks/useUserId";
import { ConversationWithLastMessage } from "../../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import useFindOtherUserOfOnetoOneConvo from "../../hooks/useFindOtherUserOfOnetoOneConvo";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import { BaseConverstion } from "../../Types/Conversation";
import useChatTyping from "../../hooks/useChatTyping";
import { format } from "date-fns";

type Props = {
  convo: ConversationWithLastMessage & { otherUser?: BasicUserDetails };
} & ComponentPropsWithoutRef<"div">;

const ConversationListItem: React.FC<Props> = ({ convo, className }) => {
  const currentUserId = useUserId();
  const [otherUserProfile, setOtherUserProfile] = useState<BasicUserDetails | undefined>(
    convo.otherUser,
  );
  const find = useFindOtherUserOfOnetoOneConvo();

  let otherParticipant: BaseConverstion["participants"][0] | undefined;
  if (!convo.otherUser) {
    otherParticipant = find(convo.participants);
  }
  const { user } = usePublicUserProfileQuery(otherParticipant?.userId);

  useEffect(() => {
    if (!user) return;
    setOtherUserProfile(user);
  }, [user]);

  const { typing } = useChatTyping(convo.id);

  const now = new Date();
  const messageDate = new Date(convo.lastMessage?.sendAt ?? convo.updatedAt ?? convo.createdAt);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  const timeString =
    diffInHours > 24 ? format(messageDate, "dd MMM yyyy") : format(messageDate, "hh:mm a");

  return (
    <div className={`mb-2 flex h-fit cursor-pointer gap-3 ${className}`}>
      <div className="size-10 min-w-10 overflow-hidden rounded-full">
        <ProfilePicSmall avatarURL={otherUserProfile?.avatarURL} />
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="">
          <p className="text-base">
            {otherUserProfile
              ? `${otherUserProfile.firstName} ${otherUserProfile.lastName || ""}`
              : "Humane user"}
          </p>

          {/* replace with typing indicator if there is any */}
          {!typing ? (
            <p className="flex items-center text-sm text-zinc-400">
              {/* only for groups: display the author of last message */}
              {convo.type === "group" && convo.lastMessage?.senderId === currentUserId
                ? "you:"
                : ""}

              {convo.lastMessage && (
                <>
                  {" "}
                  {
                    convo.lastMessage.senderId === currentUserId &&
                      !convo.lastMessage.status?.deleted && <>you:&nbsp;</>
                    // <CheckCheck className="text-pop-green/70 me-1" size={18} />
                  }
                  <span className="inline-block max-w-60 truncate overflow-hidden align-middle text-ellipsis">
                    {convo.lastMessage.message}
                  </span>
                </>
              )}

              {convo.lastMessage?.status?.deleted && (
                <span className="text-sm text-zinc-400 italic">message deleted</span>
              )}
            </p>
          ) : (
            <p className="text-pop-green/80 text-sm">Typing</p>
          )}
        </div>

        <div className="relative flex flex-col items-end justify-start">
          <p className="text-sm text-zinc-400">{timeString}</p>
          {convo.unreadCount > 0 && (
            <p className="bg-pop-green/90 relative top-0.5 size-fit rounded-full p-0.5 px-1.5 text-center align-middle text-xs text-black">
              {convo.unreadCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;
