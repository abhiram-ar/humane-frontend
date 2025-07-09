import { Bell, Home, MessageSquareText, Settings, User, UserRound } from "lucide-react"; // optional icons
import humanelogo from "@/assets/humaneSegoeScriptBold.svg";
import CreatePostButton from "./CreatePostButton";
import UserLogout from "@/features/profile/components/extended/UserLogout";
import SidebarMenuItem from "./SidebarMenuItem";
import NotificationSidebarMenuItem from "./NotificationSidebarMenuItem";

const Sidebar = () => {
  return (
    <div className="bg-grey fixed flex h-screen w-60 flex-col justify-between text-white lg:w-90">
      <div className="text-pop-green px-8 pt-3 text-2xl font-bold lg:px-12">
        <img src={humanelogo} alt="" />
      </div>

      <div className="-mt-15">
        <div className="me-5">
          <div>
            <SidebarMenuItem name="Home" Icon={Home} path="/" />
            <SidebarMenuItem name="Search" Icon={User} path="/search" />
            <SidebarMenuItem name="Messages" Icon={MessageSquareText} path="/chat" />
            <NotificationSidebarMenuItem name="Notifications" Icon={Bell} path="/notification" />
            <SidebarMenuItem name="Profile" Icon={UserRound} path="/profile" />
            <SidebarMenuItem name="Settings" Icon={Settings} path="/settings" />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <CreatePostButton />
        </div>
      </div>

      <div className="me-5 mb-3">
        <UserLogout />
      </div>
    </div>
  );
};

export default Sidebar;
