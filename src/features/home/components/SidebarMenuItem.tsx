import { LucideIcon } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

type Props = {
  name: string;
  path: string;
  Icon: LucideIcon;
};
const SidebarMenuItem: React.FC<Props> = ({ path, Icon, name }) => {
  return (
    <div>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `my-3 flex items-center gap-3 rounded-e-2xl px-10 py-3 text-xl transition-all duration-500 ease-out ${
            isActive ? "bg-grey-light font-semibold" : "hover:bg-zinc-700/50"
          }`
        }
      >
        <Icon />
        {name}
      </NavLink>
    </div>
  );
};

export default SidebarMenuItem;
