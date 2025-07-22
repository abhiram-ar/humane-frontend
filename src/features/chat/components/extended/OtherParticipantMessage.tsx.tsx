import React from "react";
import { Message } from "../../Types/Message";
import { format } from "date-fns";

type Props = {
  message: Message;
};

const OtherParticipantMessage: React.FC<Props> = ({ message }) => {
  const timeString = format(message.sendAt, "hh:mm a - dd MMM");
  return (
    <div className="mb-1 flex w-full">
      {/* message itself */}
      <div className="relative ms-2 max-w-3/5 min-w-35 rounded-t-lg rounded-br-lg bg-pink-200/95 p-2 pb-5 outline-none hover:bg-pink-200">
        <p>{message.message}</p>

        {/* medtadata */}
        <div className="absolute bottom-1 right-2 flex w-fit items-center gap-1 text-xs text-zinc-500">
          <p>{timeString}</p>
        </div>
      </div>

      {/* options */}
      <div className="w-full"></div>
    </div>
  );
};

export default OtherParticipantMessage;
