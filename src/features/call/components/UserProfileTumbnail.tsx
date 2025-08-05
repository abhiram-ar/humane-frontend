import ProfilePic from "@/features/profile/components/base/ProfilePic";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import React, { ComponentPropsWithoutRef } from "react";

type Props = {
  userId?: string;
  minimized?: boolean;
} & ComponentPropsWithoutRef<"div">;
const UserProfileTumbnail: React.FC<Props> = ({ userId, minimized, ...props }) => {
  const { user } = usePublicUserProfileQuery(userId);
  return (
    <div className="h-full w-full bg-radial-[at_50%_75%] from-zinc-600 to-zinc-800" {...props}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center font-semibold text-white">
          <ProfilePic
            url={user?.avatarURL}
            className={`relative z-10 size-25 overflow-clip rounded-full border border-zinc-400/50 bg-zinc-500 ${minimized ? "lg:size-20" : "lg:size-30"}`}
          />
          <p>You</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileTumbnail;
