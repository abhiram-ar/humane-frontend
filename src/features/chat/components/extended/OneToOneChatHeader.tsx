import HumaneScoreNumberFlow from "@/components/HumaneScoreNumberFlow";
import ProfilePicSmall from "@/components/ProfilePicSmall";
import { Skeleton } from "@/components/ui/skeleton";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import { Phone, Video } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import UserOnlineAndTypingIndicator from "./UserOnlineAndTypingIndicator";

type Props = {
  otherUserId: string;
};

const OneToOneChatHeader: React.FC<Props> = ({ otherUserId }) => {
  const { user, httpStatus } = usePublicUserProfileQuery(otherUserId ?? "invalid");

  return (
    <div className="flex w-full items-center justify-between border-b border-zinc-400/50 px-5 py-3">
      <div className="flex items-center gap-2">
        <ProfilePicSmall avatarURL={user?.avatarURL} />
        <div>
          {httpStatus ? (
            <div className="flex gap-1">
              <Link to={`/user/${user?.id}`}>
                <p className="text-almost-white hover:underline">
                  {user && httpStatus < 400 && `${user?.firstName} ${user?.lastName ?? ""}`}
                  {httpStatus === 404 && "Invalid user"}
                </p>
              </Link>

              <UserOnlineAndTypingIndicator userId={otherUserId} />
            </div>
          ) : (
            <Skeleton className="w-20 text-transparent">.</Skeleton>
          )}
          <div>
            <HumaneScoreNumberFlow className="gap-0.5" score={user?.humaneScore ?? 0} />
          </div>
        </div>
      </div>
      <div className="text-almost-white flex items-center gap-1 overflow-hidden rounded-xl border-zinc-400/50 px-3 xl:gap-3">
        <div className="hover:bg-green-subtle/90 rounded-full p-2 hover:text-black">
          <Phone size={20} />
        </div>
        <div className="hover:bg-green-subtle/90 rounded-full p-2 hover:text-black">
          <Video />
        </div>
      </div>
    </div>
  );
};

export default OneToOneChatHeader;
