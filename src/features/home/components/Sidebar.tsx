import { Bell, Home, LucideIcon, MessageSquareText, Settings, User, UserRound } from "lucide-react"; // optional icons
import { NavLink } from "react-router";
import humanelogo from "@/assets/humaneSegoeScriptBold.svg";
import CreatePostButton from "./CreatePostButton";

type SidebarCongfig = {
  name: string;
  icon: LucideIcon;
  path: string;
};

const config: SidebarCongfig[] = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Search", icon: User, path: "/search" },
  { name: "Messages", icon: MessageSquareText, path: "/message" },
  { name: "Notification", icon: Bell, path: "/notification" },
  { name: "Profile", icon: UserRound, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  return (
    <div className="bg-grey fixed h-screen w-90 text-white">
      <div className="text-pop-green mb-5 px-12 py-8 text-2xl font-bold">
        <img src={humanelogo} alt="" />
      </div>
      <div className="me-5">
        <div>
          {config.map((data, index) => (
            <div key={index}>
              <NavLink
                to={data.path}
                className={({ isActive }) =>
                  `my-3 flex items-center gap-3 rounded-e-2xl px-10 py-3 text-xl transition-all duration-500 ease-out ${
                    isActive ? "bg-grey-light font-semibold" : "hover:bg-zinc-700/50"
                  }`
                }
              >
                <data.icon />
                {data.name}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <CreatePostButton />
      </div>
    </div>
  );
};

export default Sidebar;
