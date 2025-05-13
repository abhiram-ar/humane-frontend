import React from "react";

type Props = {
  url: string;
};
const CoverPhoto: React.FC<Props> = ({ url }) => {
  return (
    <div className="h-60 w-full bg-zinc-400 overflow-clip">
      <img className="h-full w-full object-cover" src={url} alt="" />
    </div>
  );
};

export default CoverPhoto;
