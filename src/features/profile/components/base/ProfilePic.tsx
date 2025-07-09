import { User } from "lucide-react";
import { useState } from "react";

type Props = {
  url?: string;
};
const ProfilePic: React.FC<Props> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="border-grey-light relative z-10 size-30 lg:size-52 overflow-clip rounded-full border-3 bg-zinc-500">
      {isLoading && url && <div className="absolute inset-0 animate-pulse bg-zinc-400/50"></div>}
      {(isError || !url) && (
        <div
          onLoad={() => setIsLoading(false)}
          className={`animate-in absolute inset-0 flex h-full w-full scale-110 items-center justify-center bg-zinc-500 text-white/30 duration-[2000]`}
        >
          <User size={40} />
        </div>
      )}
      <img
        src={url}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
        className={`h-full w-full object-cover transition-all duration-100 ease-in ${isLoading ? "scale-102 opacity-0" : "scale-100 opacity-100"} `}
        alt=""
      />
    </div>
  );
};

export default ProfilePic;
