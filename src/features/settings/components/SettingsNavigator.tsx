import { useIsMobile } from "@/hooks/useIsMobile";
import { Key, LucideIcon, Settings, User } from "lucide-react"; // optional icons
import { NavLink } from "react-router";

type SidebarCongfig = {
  name: string;
  icon: LucideIcon;
  path: string;
};

const config: SidebarCongfig[] = [
  { name: "Profile", icon: User, path: "profile" },
  { name: "Password", icon: Key, path: "password" },
];

const SettingsNavigator = () => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`bg-grey fixed z-10 h-screen border-x border-zinc-500/50 text-white ${isMobile ? "w-full" : "w-72"}`}
    >
      <div className="text-pop-green min-h mt-10 mb-3 flex items-center justify-start gap-2 px-5 py-2 pb-5 text-2xl font-bold">
        <Settings /> Settings
      </div>
      <div>
        <div>
          {config.map((data, index) => (
            <div key={index}>
              <NavLink
                to={data.path}
                className={({ isActive }) =>
                  `my-3 flex items-center gap-3 px-6 py-3 transition-all duration-500 ease-out ${
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
    </div>
  );
};

export default SettingsNavigator;
