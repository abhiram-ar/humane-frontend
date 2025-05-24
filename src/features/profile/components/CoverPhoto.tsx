import React, { useState } from "react";

type Props = {
  url: string;
};
const CoverPhoto: React.FC<Props> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative h-60 w-full overflow-clip bg-zinc-500">
      {isLoading && <div className={`absolute inset-0 animate-pulse bg-zinc-600`}></div>}

      <img
        className={`h-full w-full object-cover transition-all duration-500 ease-out ${isLoading ? "scale-105 opacity-0" : "scale-100 opacity-100"} `}
        src={url}
        alt="cover photo"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default CoverPhoto;
