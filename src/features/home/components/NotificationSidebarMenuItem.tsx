import React, { ComponentProps, useEffect } from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/features/notification/Types/SocketIOConfig.types";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  addNotification,
  removeNotification,
  setNotificationList,
  updateNotification,
} from "@/features/notification/redux/notificationSlice";
import { NavLink } from "react-router";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { useIsMobile } from "@/hooks/useIsMobile";
import { setLastRewaredAt } from "@/features/profile/redux/profilleSlice";
import useUserId from "@/hooks/useUserId";
import { GetPublicUserHumaneScore } from "@/hooks/usePublicUserHumaneScoreQuery";
import toast from "react-hot-toast";
import { toastMessages } from "@/constants/ToastMessages";
import { InfiniteTimelineData } from "@/features/profile/Types/InfiniteTimelinedata.type";
import { produce } from "immer";
import useRecentNotificaionInifiniteQuey from "@/features/notification/hooks/useRecentNotificaionInifiniteQuey";

const NotificationSidebarMenuItem: React.FC<ComponentProps<typeof SidebarMenuItem>> = ({
  Icon,
  path,
  name,
}) => {
  const token = useAppSelector((state) => state.userAuth.token);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const userId = useUserId();
  const queryClient = useQueryClient();

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
      dispatch(updateNotification(noti));
    });

    socket.on("user-rewarded", (amount, rewardedAt) => {
      dispatch(setLastRewaredAt(new Date(rewardedAt).toISOString()));
      queryClient.setQueryData(
        ["total-humane-score", userId],
        (oldData: GetPublicUserHumaneScore["data"]) => {
          if (!oldData) return oldData;
          return {
            userId: oldData.userId,
            score: oldData.score + amount,
          } as GetPublicUserHumaneScore["data"];
        },
      ); // delay since Read model will have stale data
    });

    socket.on("post-moderation-completed", (postId, status) => {
      if (status === "ok")
        toast.success(toastMessages.POST_CHECK_COMLETED_SUCCESSFULY, { position: "top-right" });
      else if (status === "failed")
        toast.error(toastMessages.POST_CHECK_FAILED, { position: "top-right" });
      else if (status === "notAppropriate")
        toast(toastMessages.POST_CHECK_NON_APPROPRIATRE_CONTENT_FOUND, { position: "top-right" });

      if (!userId) {
        console.warn("no userId to optimistcally update post moderationstatus");
        return;
      }

      queryClient.setQueryData(["timeline", userId], (oldData: InfiniteTimelineData) => {
        if (!oldData) return oldData;

        const newState = produce(oldData, (draft) => {
          draft.pages.forEach((page) =>
            page.posts.forEach((post) => {
              if (post.id === postId) post.moderationStatus = status;
            }),
          );
        });
        return newState;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, token]);

  const { data } = useRecentNotificaionInifiniteQuey();

  useEffect(() => {
    console.log("Running set notification state from http");
    if (data) {
      dispatch(setNotificationList(data.pages.flatMap((page) => page.noti)));
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
    return state.notifications.recentNoti[0].id;
  });

  const handleMarkAsDone = () => {
    if (veryRecentNotiId) {
      api
        .patch(`${API_ROUTES.NOTIFICATION_SERVICE}/isRead`, { fromId: veryRecentNotiId })
        .catch((err) => console.log("error while marking notification as read", err));
    }
  };

  return (
    <div onClick={handleMarkAsDone}>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `transition-all duration-500 ease-out ${!isMobile ? "my-3 flex items-center gap-3 rounded-e-2xl px-10 py-3 text-xl" : "flex items-center rounded-2xl px-5 py-3 text-xl"} ${
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
        {!isMobile && name}
      </NavLink>
    </div>
  );
};

export default NotificationSidebarMenuItem;
