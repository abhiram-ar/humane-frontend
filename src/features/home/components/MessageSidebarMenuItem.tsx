import React, { ComponentProps, useEffect } from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import { NavLink } from "react-router";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import useConversaionListInifiteQuery from "@/features/chat/hooks/useConversaionListInifiteQuery";
import { addToConversationList } from "@/features/chat/redux/chatSlice";

const MessageSidebarMenuItem: React.FC<ComponentProps<typeof SidebarMenuItem>> = ({
  Icon,
  path,
  name,
}) => {
  const isMobile = useIsMobile();
  const unReadConversations = useAppSelector((state) => state.chat.ghfgf);
  const dispath = useAppDispatch();

  const { data } = useConversaionListInifiteQuery();

  useEffect(() => {
    if (!data) return;
    dispath(addToConversationList(data.pages.flatMap((page) => page.conversations)));
  }, [data, dispath]);

  return (
    <div>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `transition-all duration-500 ease-out ${!isMobile ? "my-3 flex items-center gap-3 rounded-e-2xl px-10 py-3 text-xl" : "flex items-center rounded-2xl px-5 py-3 text-xl"} ${
            isActive ? "bg-grey-light font-semibold" : "hover:bg-zinc-700/50"
          }`
        }
      >
        <div className="relative">
          {unReadConversations > 0 ? (
            <div className="bg-pop-green absolute -top-1.5 -left-1 rounded-full px-1.25 text-xs text-black">
              {unReadConversations}
            </div>
          ) : null}
          <Icon />
        </div>
        {!isMobile && name}
      </NavLink>
    </div>
  );
};

export default MessageSidebarMenuItem;
