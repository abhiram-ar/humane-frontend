import { MessageCirclePlus } from "lucide-react";
import SearchChatBar from "./SearchChatBar";
import ConversationList from "./ConversationList";
import Friends from "./Friends.trigger";

const Conversations = () => {
  return (
    <div className="relative h-screen max-h-screen overflow-hidden border-x border-zinc-400/50">
      <h2 className="text-almost-white px-5 py-5 text-xl font-semibold">Messages</h2>
      <SearchChatBar />
      <div className="mt-2 h-[86vh] overflow-y-auto">
        <ConversationList />
      </div>
      <div></div>
      <div className="absolute right-5 bottom-5">
        <Friends>
          <div className="bg-almost-white hover:bg-pop-green cursor-pointer rounded-full p-3">
            <MessageCirclePlus className="text-black" />
          </div>
        </Friends>
      </div>
    </div>
  );
};

export default Conversations;
