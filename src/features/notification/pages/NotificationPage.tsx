import FriendReqNoti from "../Components/FriendReqNoti";
import { FriendReqNotification } from "../Types/FriendReqNoti";

const NotificationPage = () => {
 
  const tempNotis: FriendReqNotification[] = Array(20)
    .fill(0)
    .map(() => ({
      type: "friend-req",
      id: "",
      isRead: Math.random() > 0.5 ? true : false,
      updatedAt: "",
      friendshipId: "",
      reciverId: "",
      requesterId: "",
      createdAt: "",
      status: Math.random() > 0.5 ? "ACCEPTED" : "PENDING",
    }));
  console.log(Math.random());
  return (
    <div className="min-h-full w-120 border-x border-zinc-400/50">
      <h2 className="text-almost-white border-b border-zinc-400/50 px-5 py-10 text-xl font-semibold">
        Notifications
      </h2>

      <div>
        {tempNotis.map((noti, i) => (
          <FriendReqNoti key={i} noti={noti} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
