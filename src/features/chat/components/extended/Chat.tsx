import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import SendMessageBar from "./SendMessageBar";

const Chat = () => {
  return (
    <div className="relative h-screen w-full overflow-y-scroll">
      <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 backdrop-blur-lg">
        <ChatHeader />
      </div>

      <div>
        <MessagesContainer />

        <div className="absolute w-4/5 bottom-0 left-1/2 z-30 -translate-x-1/2 transform">
          <SendMessageBar />
        </div>
      </div>
    </div>
  );
};

export default Chat;
