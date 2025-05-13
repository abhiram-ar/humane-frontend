import { useState } from "react";

type Props = {
  url: string;
};
const ProfilePic: React.FC<Props> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="border-grey-light relative h-52 w-52 overflow-hidden rounded-full border-3 bg-zinc-500">
      {isLoading && <div className="absolute inset-0 animate-pulse bg-zinc-400/20"></div>}
      <img
        src={url}
        onLoad={() => setIsLoading(false)}
        className={`h-full w-full object-cover transition-all duration-100 ease-in ${isLoading ? "scale-102 opacity-0" : "scale-100 opacity-100"} `}
        alt=""
      />
    </div>
  );
};

export default ProfilePic;
