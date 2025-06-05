import ProfilePicSmall from "./ProfilePicSmall";
import { Link } from "react-router";
import { ActionableUser } from "../Types/CombinedNotiWithActionableUser";
import { FriendReqAcceptedNotification } from "../Types/FriendReqAcceptedNoti";

type Props = {
  noti: FriendReqAcceptedNotification & ActionableUser;
};
const FriendReqAcceptedNoti: React.FC<Props> = ({ noti }) => {
  if (!noti.actionableUser) {
    console.error("actionable user missing for friendReq noti", noti);
    return;
  }

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
          Accepted your request
        </div>
      </div>
    </div>
  );
};

export default FriendReqAcceptedNoti;
