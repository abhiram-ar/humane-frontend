import React from "react";

type Props = {
  profileURL: string;
  userName: string;
};

const UserListItem: React.FC<Props> = ({ profileURL, userName }) => {
  return (
    <div className="mb-5 flex h-fit cursor-pointer items-center gap-3 hover:underline">
      <div className="size-10 overflow-hidden rounded-full">
        <img className="h-full w-full object-cover" src={profileURL} alt="" />
      </div>
      <p>{userName}</p>
    </div>
  );
};

export default UserListItem;
