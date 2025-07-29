import { Outlet } from "react-router";
import Conversations from "../components/extended/Conversations";

const ChatWithMessagesPage = () => {
  return (
    <div className="flex">
      <div className="w-100 min-w-100">
        <Conversations />
      </div>
      <Outlet />
    </div>
  );
};

export default ChatWithMessagesPage;
