import Chat from "../components/extended/Chat";
import Conversations from "../components/extended/Conversations";

const ChatWithMessagesPage = () => {
  return (
    <div className="flex">
      <div className="w-100">
        <Conversations />
      </div>
      <Chat />
    </div>
  );
};

export default ChatWithMessagesPage;
