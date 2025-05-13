import { useState } from "react";

type Props = {
  url: string;
};
const ProfilePic: React.FC<Props> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="border-grey-light relative h-52 w-52 overflow-hidden rounded-full border-3 bg-zinc-500">
      {isLoading && <div className="absolute inset-0 animate-pulse bg-zinc-400"></div>}
      <img
        src={url}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        className={`h-full w-full object-cover transition-all duration-0 ease-in ${isLoading ? "opacity-0" : "opacity-100"} `}
        alt=""
      />
    </div>
  );
};

export default ProfilePic;
