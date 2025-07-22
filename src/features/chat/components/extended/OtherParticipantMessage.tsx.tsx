import React from "react";

type Props = {
  message: string;
};

const OtherParticipantMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="mb-1 flex w-full">
      {/* message itself */}
      <div className="ms-2 max-w-3/5 rounded-t-lg rounded-br-lg bg-pink-200/95 p-2 outline-none hover:bg-pink-200">
        {message}
      </div>

      {/* options */}
      <div className="w-full"></div>
    </div>
  );
};

export default OtherParticipantMessage;
