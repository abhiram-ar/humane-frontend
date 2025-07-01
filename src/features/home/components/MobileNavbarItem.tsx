import { LucideIcon } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

type Props = {
  name: string;
  path: string;
  Icon: LucideIcon;
};
const MobileNavbarItem: React.FC<Props> = ({ path, Icon }) => {
  return (
    <div>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center rounded-2xl px-5 py-3 text-xl transition-all duration-500 ease-out ${
            isActive ? "bg-grey-light font-semibold" : "hover:bg-zinc-700/50"
          }`
        }
      >
        <Icon />
      </NavLink>
    </div>
  );
};

export default MobileNavbarItem;
