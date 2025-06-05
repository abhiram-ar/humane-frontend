import { User } from "lucide-react";
import React, { useState } from "react";

const ProfilePicSmall: React.FC<{ avatarURL?: string | null }> = ({ avatarURL }) => {
  const [isProfilePicLoading, setProfilePicLoading] = useState(true);
  return (
    <div>
      {avatarURL ? (
        <div className="border-grey-light relative h-10 w-10 overflow-clip rounded-full">
          {isProfilePicLoading && (
            <div className="absolute inset-0 animate-pulse bg-zinc-400"></div>
          )}
          <img
            src={avatarURL}
            className={`h-full w-full object-cover transition-all duration-100 ease-in ${isProfilePicLoading ? "scale-102 opacity-0" : "scale-100 opacity-100"} `}
            alt="profilepic"
            onLoad={() => setProfilePicLoading(false)}
          />
        </div>
      ) : (
        <div className="border-grey-light text-offwhite relative flex h-10 w-10 items-center justify-center overflow-clip rounded-full border bg-zinc-600/50">
          <User />
        </div>
      )}
    </div>
  );
};

export default ProfilePicSmall;
