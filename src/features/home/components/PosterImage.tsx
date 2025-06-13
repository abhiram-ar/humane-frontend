import { ImageOff } from "lucide-react";
import React, { ComponentPropsWithRef, useState } from "react";

const PosterImage: React.FC<ComponentPropsWithRef<"div"> & { url: string }> = ({
  url,
  className,
  ...props
}) => {
  const [orientation, SetOrientation] = useState<"landscape" | "potrait" | "unknown">("potrait");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleOnload: React.DOMAttributes<HTMLImageElement>["onLoad"] = (e) => {
    const { naturalHeight, naturalWidth } = e.target as HTMLImageElement;
    if (naturalHeight > naturalWidth) {
      SetOrientation("potrait");
    } else {
      SetOrientation("landscape");
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`relative aspect-auto overflow-clip rounded-xl ${orientation === "potrait" ? "max-h-110 w-fit" : ""} ${className} ${isError ? "h-110 w-full" : ""}`}
      {...props}
    >
      {isLoading && url && (
        <div className="absolute inset-0 z-10 h-full w-full animate-pulse rounded-2xl border border-zinc-400/50 bg-zinc-400/50"></div>
      )}

      {(isError || !url) && (
        <div
          onLoad={() => setIsLoading(false)}
          className={`animate-in absolute inset-0 z-10 flex h-full w-full scale-110 items-center justify-center bg-zinc-500 text-white/30 duration-[2000]`}
        >
          <ImageOff className="text-white" size={40} />
        </div>
      )}

      <img
        onLoad={handleOnload}
        className={`aspect-auto h-full w-full object-cover ${isLoading ? "scale-102 opacity-0" : "scale-100 opacity-100"} ${orientation === "potrait" ? "max-h-110" : ""}`}
        src={url}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
        alt=""
      />
    </div>
  );
};

export default PosterImage;
