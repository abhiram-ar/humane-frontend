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

const NotificationSidebarMenuItem: React.FC<ComponentProps<typeof SidebarMenuItem>> = (props) => {
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
  }, [token]);

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

  return <SidebarMenuItem {...props} />;
};

export default NotificationSidebarMenuItem;
