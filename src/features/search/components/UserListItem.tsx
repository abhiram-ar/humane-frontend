import ProfilePicSmall from "@/components/ProfilePicSmall";
import React, { ComponentPropsWithoutRef } from "react";

type Props = {
  profileURL: string | null | undefined;
  userName: string;
} & ComponentPropsWithoutRef<"div">;

const UserListItem: React.FC<Props> = ({ profileURL, userName, className }) => {
  return (
    <div
      className={`mb-2 flex h-fit cursor-pointer items-center gap-3 hover:underline ${className}`}
    >
      <div className="size-10 overflow-hidden rounded-full">
        <ProfilePicSmall avatarURL={profileURL} />
      </div>
      <p>{userName}</p>
    </div>
  );
};

export default UserListItem;
