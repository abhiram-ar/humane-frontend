import { format } from "date-fns";
import { CheckCheck, CircleX, Clock } from "lucide-react";
import React from "react";
import { Message } from "../../Types/Message";

type Props = {
  message: Message;
};

const UserMessage: React.FC<Props> = ({ message}) => {
  const timeString = format(message.sendAt, "hh:mm a - dd MMM");
  return (
    <div className="mb-1 flex w-full">
      {/* options */}
      <div className="w-full"></div>

      {/* message itself */}
      <div className="bg-green-subtle/95 hover:bg-green-subtle relative me-2 max-w-3/5 min-w-35 rounded-t-lg rounded-bl-lg p-2 pb-5">
        <p>{message.message}</p>

        {/* medtadata */}
        <div className="absolute right-1 bottom-1 flex w-fit items-center gap-1 text-xs text-zinc-500">
          <p>{timeString}</p>

          {message.sendStatus && message.sendStatus === "pending" && <Clock size={13} />}
          {message.sendStatus && message.sendStatus === "error" && <CircleX className="fill-red-400" size={13} />}

          {!message.sendStatus && <CheckCheck className="text-green-800" size={13} />}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
