import { User } from "lucide-react";
import React, { useState, useRef, useEffect, ComponentPropsWithoutRef } from "react";

const ProfilePicSmall: React.FC<
  ComponentPropsWithoutRef<"div"> & { avatarURL?: string | null }
> = ({ avatarURL, className, ...props }) => {
  const [isProfilePicLoading, setProfilePicLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      // image is already cached and loaded
      setProfilePicLoading(false);
    } else {
      setProfilePicLoading(true);
    }
  }, [avatarURL]);

  return (
    <div>
      {avatarURL ? (
        <div
          className={`border-grey-light relative h-10 w-10 overflow-clip rounded-full ${className}`}
          {...props}
        >
          {isProfilePicLoading && (
            <div className="absolute inset-0 z-10 animate-pulse bg-zinc-400"></div>
          )}
          <img
            ref={imgRef}
            src={avatarURL}
            className={`h-full w-full object-cover transition-all duration-100 ease-in ${
              isProfilePicLoading ? "scale-102 opacity-0" : "scale-100 opacity-100"
            }`}
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
