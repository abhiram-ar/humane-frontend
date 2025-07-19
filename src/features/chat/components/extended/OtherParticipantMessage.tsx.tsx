import React from "react";

type Props = {
  message: string;
  sendAt: string;
  status: string;
};

const OtherParticipantMessage: React.FC<Props> = ({ message, sendAt, status }) => {
  return (
    <div className="mb-1 flex w-full ">
      {/* message itself */}
      <div className="hover:bg-pink-200 ms-2 outline-none max-w-3/5 rounded-t-lg rounded-br-lg  bg-pink-200/95 p-2">
        {message}
      </div>

      {/* options */}
      <div className="w-full"></div>
    </div>
  );
};

export default OtherParticipantMessage;
