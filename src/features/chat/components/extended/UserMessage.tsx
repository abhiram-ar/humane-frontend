import React from "react";

type Props = {
  message: string;
  sendAt: string;
  status: string;
};

const UserMessage: React.FC<Props> = ({ message, sendAt, status }) => {
  return <div className="min-h-10 min-w-10"></div>;
};

export default UserMessage;
