import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import FriendReqNoti from "../Components/FriendReqNoti";
import { useEffect, useRef } from "react";
import { markAllAsRead, setNotificationList } from "../redux/notificationSlice";
import FriendReqAcceptedNoti from "../Components/FriendReqAcceptedNoti";
import PostGotNoti from "../Components/PostGotCommentNoti";
import CommnetLikesNotification from "../Components/CommnetLikesNotification";
import PostModerationFlaggedNoti from "../Components/PostModerationFlaggedNoti";
import PostModerationFailedNoti from "../Components/PostModerationFailedNoti";
import useRecentNotificaionInifiniteQuey from "../hooks/useRecentNotificaionInifiniteQuey";
import Spinner from "@/components/Spinner";

const NotificationPage = () => {
  const recentNoti = useAppSelector((state) => state.notifications.recentNoti);
  const dispath = useAppDispatch();
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useRecentNotificaionInifiniteQuey();

  useEffect(() => {
    dispath(markAllAsRead());
  }, [dispath]);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver((entry) => {
      // make sure we dont fetch the page when a request is in flight
      if (entry[0].isIntersecting && hasNextPage && !isFetching) {
        console.log("fetching next page");
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

  useEffect(() => {
    console.log("Running set notification state from http");
    if (data) {
      dispath(setNotificationList(data.pages.flatMap((page) => page.noti)));
    }
  }, [data, dispath]);

  console.log(data, hasNextPage, isFetching);

  return (
    <div className="min-h-full border-x border-zinc-400/50 lg:w-120">
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
          else if (noti.type === "comment-likes")
            return <CommnetLikesNotification key={noti.id} noti={noti} />;
          else if (noti.type === "post-moderation-flagged")
            return <PostModerationFlaggedNoti key={noti.id} noti={noti} />;
          else if (noti.type === "post-moderation-failed")
            return <PostModerationFailedNoti key={noti.id} noti={noti} />;
        })}
      </div>

      <div ref={observerRef} />

      <div className="pb-5">
        {(isFetching || isLoading) && <Spinner />}

        {data && !hasNextPage && !isFetching && (
          <p className="mt-5 text-center text-sm text-zinc-400">All notification covered 👍</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
