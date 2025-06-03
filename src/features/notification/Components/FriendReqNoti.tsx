import ProfilePicSmall from "./ProfilePicSmall";
import { Link } from "react-router";
import ButtonPop from "@/components/ButtonPop";

const FriendReqNoti = () => {
  return (
    <div className="flex items-center justify-between gap-2 py-5 px-6 border-b border-zinc-400/50">
      <div className="flex items-center gap-3">
        <ProfilePicSmall />
        <div className="text-white">
      <Link to="" className=" text-green-subtle hover:underline">
            Abhiram AR
          </Link>{" "}
          Send you a friend request
        </div>
      </div>
      <div>
        <ButtonPop>View</ButtonPop>
      </div>
    </div>
  );
};

export default FriendReqNoti;
