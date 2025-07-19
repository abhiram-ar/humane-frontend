import React from "react";

type Props = {
  message: string;
  sendAt: string;
  status: string;
};

const UserMessage: React.FC<Props> = ({ message, sendAt, status }) => {
  return (
    <div className="flex w-full mb-1">
      {/* options */}
      <div className="w-full"></div>

      {/* message itself */}
      <div className="max-w-3/5  rounded-t-lg p-2 rounded-bl-lg bg-green-subtle/95 hover:bg-green-subtle me-2">{message}</div>
    </div>
  );
};

export default UserMessage;
