import { User } from "lucide-react";
import React from "react";

type Props = {
  profileURL: string | null | undefined;
  userName: string;
};

const UserListItem: React.FC<Props> = ({ profileURL, userName }) => {
  return (
    <div className="mb-5 flex h-fit cursor-pointer items-center gap-3 hover:underline">
      <div className="size-10 overflow-hidden rounded-full">
        {profileURL ? (
          <img className="h-full w-full object-cover" src={profileURL} alt="" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-400">
            <User />
          </div>
        )}
      </div>
      <p>{userName}</p>
    </div>
  );
};

export default UserListItem;
