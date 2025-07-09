import { MessageCirclePlus } from "lucide-react";
import SearchChatBar from "./SearchChatBar";
import ConversationList from "./ConversationList";

const Conversations = () => {
  return (
    <div className="relative h-screen max-h-screen overflow-hidden border-x border-zinc-400/50">
      <h2 className="text-almost-white px-5 py-5 text-xl font-semibold">Messages</h2>
      <SearchChatBar />
      <div className="h-[86vh] overflow-y-auto mt-2">
        <ConversationList />
      </div>
      <div className="bg-almost-white hover:bg-pop-green absolute right-5 bottom-5 cursor-pointer rounded-full p-3">
        <MessageCirclePlus className="text-black" />
      </div>
    </div>
  );
};

export default Conversations;
