import ChatHeader from "../components/extended/ChatHeader";
import MessagesContainer from "../components/extended/MessagesContainer";
import SendMessageBar from "../components/extended/SendMessageBar";

const OneToOneChatPage = () => {
  return (
    <div className="relative h-screen w-full overflow-y-hidden">
      <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 backdrop-blur-lg">
        <ChatHeader />
      </div>

      <div className=" max-h-10/12 overflow-y-scroll">
        <MessagesContainer />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-4/5">
        <SendMessageBar />
      </div>
    </div>
  );
};

export default OneToOneChatPage;
