import { CornerRightUp, Plus } from "lucide-react";

const SendMessageBar = () => {
  return (
    <div className="flex min-h-16 w-full gap-2 items-baseline justify-center rounded-t-3xl border border-zinc-400/50 p-2">
      <div className=" text-white  hover:bg-zinc-400/50  flex size-10 min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full">
        <Plus size={20} />
      </div>  

      <div className="w-full px-2">
        <textarea
          rows={1}
          className="max-h-30 w-full resize-none   text-white outline-0"
          id="message-input"
          style={{ overflow: "hidden" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>
      <div className="bg-pop-green/90 hover:bg-pop-green flex size-10 min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full">
        <CornerRightUp size={20} />
      </div>
    </div>
  );
};

export default SendMessageBar;
