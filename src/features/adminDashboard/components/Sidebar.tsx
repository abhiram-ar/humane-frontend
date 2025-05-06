import { BadgeInfo, Home, LucideIcon, User } from "lucide-react"; // optional icons
import { NavLink } from "react-router";
import humanelogo from "@/assets/humaneSegoeScriptBold.svg";

type SidebarCongfig = {
  name: string;
  icon: LucideIcon;
  path: string;
};

const config: SidebarCongfig[] = [
  { name: "Home", icon: Home, path: "home" },
  { name: "User", icon: User, path: "user" },
  { name: "Reports", icon: BadgeInfo, path: "report" },
];

const Sidebar = () => {
  return (
    <div className="bg-grey fixed h-screen w-72 text-white">
      <div className="text-pop-green mb-3 px-10 py-2 pb-5 text-2xl font-bold">
        <img src={humanelogo} alt="" />
      </div>
      <div className="pe-5">
        {config.map((data, index) => (
          <div key={index}>
            <NavLink
              to={data.path}
              className={({ isActive }) =>
                `my-3 flex items-center gap-3 rounded-e-xl px-6 py-3 transition-all duration-500 ease-out ${
                  isActive ? "bg-grey-light font-semibold" : "hover:bg-zinc-700/50"
                }`
              }
            >
              <data.icon size={20} />
              {data.name}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
