import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";

const Chat = () => {
  return (
    <div className="relative h-screen w-full overflow-y-scroll">
      <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 backdrop-blur-lg">
        <ChatHeader />
      </div>

      <div>
      
        <MessagesContainer />
      </div>
    </div>
  );
};

export default Chat;
