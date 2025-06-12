import React, { ComponentPropsWithRef, useState } from "react";

const PosterImage: React.FC<ComponentPropsWithRef<"div"> & { url: string }> = ({
  url,
  className,
  ...props
}) => {
  const [orientation, SetOrientation] = useState<"landscape" | "potrait">("landscape");
  const handleOnload: React.DOMAttributes<HTMLImageElement>["onLoad"] = (e) => {
    const { naturalHeight, naturalWidth } = e.target as HTMLImageElement;
    if (naturalHeight > naturalWidth) {
      SetOrientation("potrait");
    } else {
      SetOrientation("landscape");
    }
  };

  return (
    <div
      className={`aspect-auto overflow-clip rounded-xl w-fit ${orientation === "potrait" ? "max-h-120 " : ""} ${className}`}
      {...props}
    >
      <img
        onLoad={handleOnload}
        className={`aspect-auto h-full w-full object-cover ${orientation === "potrait" ? "max-h-120" : ""}`}
        src={url}
        alt=""
      />
    </div>
  );
};

export default PosterImage;
