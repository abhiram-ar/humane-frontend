import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import FriendReqNoti from "../Components/FriendReqNoti";
import { useEffect } from "react";
import { markAllAsRead } from "../redux/notificationSlice";
import FriendReqAcceptedNoti from "../Components/FriendReqAcceptedNoti";
import PostGotNoti from "../Components/PostGotCommentNoti";

const NotificationPage = () => {
  const recentNoti = useAppSelector((state) => state.notifications.recentNoti);
  const dispath = useAppDispatch();

  useEffect(() => {
    dispath(markAllAsRead());
  }, [dispath]);

  return (
    <div className="min-h-full w-120 border-x border-zinc-400/50">
      <h2 className="text-almost-white border-b border-zinc-400/50 px-5 py-10 text-xl font-semibold">
        Notifications
      </h2>

      <div>
        {recentNoti.map((noti) => {
          if (noti.type === "friend-req") return <FriendReqNoti key={noti.id} noti={noti} />;
          else if (noti.type === "friend-req.accepted")
            return <FriendReqAcceptedNoti key={noti.id} noti={noti} />;
          else if (noti.type === "post-got-comment")
            return <PostGotNoti key={noti.id} noti={noti} />;
        })}
      </div>
    </div>
  );
};

export default NotificationPage;
