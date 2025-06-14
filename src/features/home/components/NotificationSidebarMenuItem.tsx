import React, { ComponentProps, useEffect } from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/features/notification/Types/SocketIOConfig.types";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { CombinedNotificationWithActionableUser } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { api } from "@/lib/axios";
import {
  addNotification,
  removeNotification,
  setNotificationList,
  updateNotification,
} from "@/features/notification/redux/notificationSlice";
import { NavLink } from "react-router";

// TODO: refacor
type GetRecentNotificationResponse = {
  success: boolean;
  message: string;
  data: {
    noti: CombinedNotificationWithActionableUser[];
    pagination: {
      from?: string | null;
      hasMore: boolean;
    };
  };
};

const NotificationSidebarMenuItem: React.FC<ComponentProps<typeof SidebarMenuItem>> = ({
  Icon,
  path,
  name,
}) => {
  const token = useAppSelector((state) => state.userAuth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost", {
      path: "/api/v1/notification/socket.io",
      auth: { token },
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("notification socket disconnected ", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log(err);
    });

    socket.on("test", (msg) => {
      console.log(msg);
    });

    socket.on("push-noti", (noti) => {
      dispatch(addNotification(noti));
    });

    socket.on("remove-noti", (noti) => {
      dispatch(removeNotification(noti));
    });

    socket.on("update-noti", (noti) => {
      console.log("upadted", noti);
      dispatch(updateNotification(noti));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, token]);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<GetRecentNotificationResponse>("/api/v1/notification/", {
        params: { limit: 10 }, // add from
      });
      return res.data.data;
    },
  });

  useEffect(() => {
    console.log("Running set notification state from http");
    if (data) {
      dispatch(setNotificationList(data.noti));
    }
  }, [data, dispatch]);

  const unreadNoti = useAppSelector((state) =>
    state.notifications.recentNoti.reduce(
      (unread: number, current) => (current.isRead === false ? unread + 1 : unread),
      0,
    ),
  );

  const veryRecentNotiId = useAppSelector((state) => {
    const size = state.notifications.recentNoti.length;
    if (size <= 0) return null;
    return state.notifications.recentNoti[size - 1].id;
  });

  const handleMarkAsDone = () => {
    if (veryRecentNotiId) {
      api
        .patch("/api/v1/notification/isRead", { fromId: veryRecentNotiId })
        .catch((err) => console.log("error while marking notification as read", err));
    }
  };

  return (
    <div onClick={handleMarkAsDone}>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `my-3 flex items-center gap-3 rounded-e-2xl px-10 py-3 text-xl transition-all duration-500 ease-out ${
            isActive ? "bg-grey-light font-semibold" : "hover:bg-zinc-700/50"
          }`
        }
      >
        <div className="relative">
          {unreadNoti > 0 ? (
            <div className="bg-pop-green absolute -top-1.5 -left-1 rounded-full px-1.25 text-xs text-black">
              {unreadNoti}
            </div>
          ) : null}
          <Icon />
        </div>
        {name}
      </NavLink>
    </div>
  );
};

export default NotificationSidebarMenuItem;
