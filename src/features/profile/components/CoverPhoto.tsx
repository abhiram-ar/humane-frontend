import { ImageOff } from "lucide-react";
import React, { useState } from "react";

type Props = {
  url: string;
};
const CoverPhoto: React.FC<Props> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  return (
    <div className="relative h-60 w-full overflow-clip bg-zinc-500">
      {isLoading && url && <div className={`absolute inset-0 animate-pulse bg-zinc-600`}></div>}
      {(isError || !url) && (
        <div
          onLoad={() => setIsLoading(false)}
          className={`animate-in z-5 absolute inset-0 flex h-full w-full scale-110 items-center justify-center bg-zinc-600 text-zinc-400 `}
        >
          <ImageOff size={40} />
        </div>
      )}
      <img
        className={`h-full w-full object-cover transition-all duration-500 ease-out ${isLoading ? "scale-105 opacity-0" : "scale-100 opacity-100"} `}
        src={url}
        alt="cover photo"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default CoverPhoto;
