import ProfilePicSmall from "./ProfilePicSmall";
import { Link } from "react-router";
import ButtonPop from "@/components/ButtonPop";
import prof from "@/assets/testProfile.png";
import { FriendReqNotification } from "../Types/FriendReqNoti";
import ButtonLowPriority from "@/components/ButtonLowPriority";

type Props = {
  noti: FriendReqNotification;
};
const FriendReqNoti: React.FC<Props> = ({ noti }) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-zinc-400/50 px-6 py-5`}
    >
      <div className="flex items-center gap-3">
        <ProfilePicSmall avatarURL={prof} />
        <div className="text-white">
          <Link to="" className="text-green-subtle hover:underline">
            Abhiram AR
          </Link>{" "}
          Send you a friend request
        </div>
      </div>
      <div>
        {noti.status === "PENDING" && <ButtonPop>View</ButtonPop>}

        {noti.status === "ACCEPTED" && (
          <ButtonLowPriority disabled={true}>Accepted</ButtonLowPriority>
        )}
      </div>
    </div>
  );
};

export default FriendReqNoti;
