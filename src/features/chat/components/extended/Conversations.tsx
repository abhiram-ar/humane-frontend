import { MessageCirclePlus } from "lucide-react";
import SearchChatBar from "./SearchChatBar";
import ConversationList from "./ConversationList";
import Friends from "./Friends.trigger";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import ConversationSearchList from "./ConversationSearchList";

const Conversations = () => {
  const searchConvoQuery = useAppSelector((state) => state.chat.searchConvoQuery);
  return (
    <div className="relative h-screen max-h-screen overflow-hidden border-x border-zinc-400/50">
      <h2 className="text-almost-white px-5 py-5 text-xl font-semibold">Messages</h2>
      <SearchChatBar />
      <div className="mt-2 h-[86vh] overflow-y-auto">
        {!searchConvoQuery ? <ConversationList /> : <ConversationSearchList />}
      </div>

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
