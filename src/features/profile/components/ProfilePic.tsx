import { User } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  url?: string;
};
const ProfilePic: React.FC<Props> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
    }
  }, [url]);

  return (
    <div className="border-grey-light relative h-52 w-52 overflow-clip rounded-full border-3 bg-zinc-500">
      {isLoading && <div className="absolute inset-0 z-20 animate-pulse bg-red-400"></div>}
      {(isError || !url) && (
        <div
          className={`animate-in absolute inset-0 z-10 flex h-full w-full scale-110 items-center justify-center bg-zinc-500 text-white/30 duration-[2000]`}
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
