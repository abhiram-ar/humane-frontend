import ProfilePicSmall from "./ProfilePicSmall";
import { Link } from "react-router";
import ButtonPop from "@/components/ButtonPop";
import { FriendReqNotification } from "../Types/FriendReqNoti";
import ButtonLowPriority from "@/components/ButtonLowPriority";
import useUserId from "@/features/profile/hooks/useUserId";
import { ActionableUser } from "../Types/CombinedNotiWithActionableUser";

type Props = {
  noti: FriendReqNotification & ActionableUser;
};
const FriendReqNoti: React.FC<Props> = ({ noti }) => {
  // TODO: I think backed is handling this logic, might as well remove this
  const userId = useUserId();
  let role: "reciver" | "requester" | undefined;
  if (noti.reciverId === userId) {
    role = "reciver";
  } else if (noti.requesterId === userId) {
    role = "requester";
  } else {
    throw new Error("Current user is not enither requester nor reciver");
  }

  if (!noti.actionableUser) {
    console.error("actionable user missing for friendReq noti", noti);
    return;
  }

  if (role === "requester")
    return (
      <div
        className={`flex items-center justify-between gap-2 border-b border-zinc-400/50 px-6 py-5`}
      >
        <div className="flex items-center gap-3">
          <ProfilePicSmall avatarURL={noti.actionableUser.avatarURL} />
          <div className="text-white">
            <Link to="" className="text-green-subtle hover:underline">
              {`${noti.actionableUser.firstName} ${noti.actionableUser.lastName || ""}`}
            </Link>{" "}
            Accepted your request
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-zinc-400/50 px-6 py-5`}
    >
      <div className="flex items-center gap-3">
        <ProfilePicSmall avatarURL={noti.actionableUser.avatarURL} />
        <div className="text-white">
          <Link
            to={`/user/${noti.actionableUser.id}`}
            className="text-green-subtle hover:underline"
          >
            {`${noti.actionableUser.firstName} ${noti.actionableUser.lastName || ""}`}
          </Link>{" "}
          Send you a friend request
        </div>
      </div>
      <div>
        {noti.status === "PENDING" && (
          <Link to={`/user/${noti.actionableUser.id}`}>
            <ButtonPop>View</ButtonPop>
          </Link>
        )}

        {noti.status === "ACCEPTED" && (
          <ButtonLowPriority disabled={true}>Accepted</ButtonLowPriority>
        )}
      </div>
    </div>
  );
};

export default FriendReqNoti;
