import { Skeleton } from "@/components/ui/skeleton";
import ProfilePic from "@/features/profile/components/base/ProfilePic";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import React, { ComponentPropsWithoutRef } from "react";

type Props = {
  userId?: string;
  minimized?: boolean;
  showCallStatus?: boolean;
} & ComponentPropsWithoutRef<"div">;
const UserProfileTumbnail: React.FC<Props> = ({
  userId,
  minimized,
  showCallStatus = false,
  ...props
}) => {
  const { user } = usePublicUserProfileQuery(userId);
  return (
    <div className="h-full w-full bg-radial-[at_50%_75%] from-zinc-600 to-zinc-800" {...props}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex-col items-center justify-center text-center font-semibold text-white">
          <ProfilePic
            url={user?.avatarURL}
            className={`relative z-10 size-25 overflow-clip rounded-full border border-zinc-400/50 bg-zinc-500 ${minimized ? "lg:size-20" : "lg:size-30"}`}
          />
          {user ? (
            <p>{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</p>
          ) : (
            <Skeleton className="w-full border text-transparent">.</Skeleton>
          )}
          {showCallStatus && <CallRingingStatus />}
        </div>
      </div>
    </div>
  );
};

export default UserProfileTumbnail;

const CallRingingStatus = () => {
  const callStaus = useAppSelector((state) => state.call.callStatus);
  return (
    <>
      <p className="text-zinc animate-pulse font-normal text-zinc-300">
        {callStaus === "ringing" && "ringing..."}
        {callStaus === "pending" && "connecting..."}
      </p>

      {callStaus === "rejected" && (
        <p className="text-zinc font-normal text-orange-400">Declined call</p>
      )}

      {callStaus === "ended" && <p className="text-zinc font-normal text-zinc-400"> Call ended</p>}
    </>
  );
};
