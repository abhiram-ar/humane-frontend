import { PhoneMissed, PhoneOutgoing } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  timeString: string;
  callConnected?: boolean;
  direction: "left" | "right";
} & ComponentPropsWithoutRef<"div">;
const CallMessage: React.FC<Props> = ({ timeString, callConnected, direction, ...props }) => {
  const Options = <div className="flex w-full items-center justify-end text-white"></div>;

  return (
    <div>
      <div className="group mb-1 flex w-full">
        {/* message itself */}

        {direction === "right" && Options}

        <div
          className="relative me-2 max-w-3/5 min-w-35 rounded-t-lg rounded-bl-lg bg-zinc-700/80 px-2 py-3 pb-5 group-hover:bg-zinc-700"
          {...props}
        >
          {callConnected ? (
            <div className="flex items-center gap-2">
              <PhoneOutgoing size={18} className="text-zinc-400" />
              <p className="text-zinc-400">Connected</p>
            </div>
          ) : (
            <div className="flex w-40 items-center gap-2">
              <PhoneMissed size={18} className="text-red-500" />
              <p className="text-red-500">Not Connected</p>
            </div>
          )}
          {/* medtadata */}
          <div className="absolute right-1 bottom-1 flex w-fit items-center gap-1 text-xs text-zinc-400">
            <p>{timeString}</p>
          </div>
        </div>

        {direction === "left" && Options}
      </div>
    </div>
  );
};

export default CallMessage;
