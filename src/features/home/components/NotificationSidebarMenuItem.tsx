import React, { ComponentProps, useEffect } from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/features/notification/Types/SocketIOConfig.types";
import { io, Socket } from "socket.io-client";

const NotificationSidebarMenuItem: React.FC<ComponentProps<typeof SidebarMenuItem>> = (props) => {
  const token = useAppSelector((state) => state.userAuth.token);

  useEffect(() => {
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
      console.log(noti);
    });

    socket.on("remove-noti", (noti) => {
      console.log(noti);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return <SidebarMenuItem {...props} />;
};

export default NotificationSidebarMenuItem;
