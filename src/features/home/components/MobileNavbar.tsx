import { Bell, Home, Search, UserRound } from "lucide-react";
import NotificationSidebarMenuItem from "./NotificationSidebarMenuItem";
import CreatePostButton from "./CreatePostButton";
import MobileNavbarItem from "./MobileNavbarItem";

const MobileNavbar = () => {
  return (
    <div className="bg-grey-dark-bg/50 fixed z-50 -mt-16 flex w-full items-center justify-around gap-2 border-t border-zinc-400/20 py-2 text-white backdrop-blur-2xl">
      <MobileNavbarItem name="Home" Icon={Home} path="/" />
      <MobileNavbarItem name="Search" Icon={Search} path="/search" />
      {/* <MobileNavbarItem name="Messages" Icon={MessageSquareText} path="/message" /> */}
      <CreatePostButton />
      <NotificationSidebarMenuItem name="Notifications" Icon={Bell} path="/notification" />
      <MobileNavbarItem name="Profile" Icon={UserRound} path="/profile" />
    </div>
  );
};

export default MobileNavbar;
