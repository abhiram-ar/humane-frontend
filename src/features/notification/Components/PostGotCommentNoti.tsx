import ProfilePicSmall from "../../../components/ProfilePicSmall";
import { Link } from "react-router";
import { ActionableUser } from "../Types/CombinedNotiWithActionableUser";
import { PostGotCommentNotification } from "../Types/PostGotCommnetNotification";
import ButtonNeutal from "@/components/ButtonNeutal";

type Props = {
  noti: PostGotCommentNotification & ActionableUser;
};
const PostGotNoti: React.FC<Props> = ({ noti }) => {
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
          commented under your post
          <p>"{noti.metadata.commentContent}"</p>
        </div>
      </div>
      <div>
        {noti.metadata.postId && (
          <Link to={`/post/${noti.metadata.postId}`}>
            <ButtonNeutal>View</ButtonNeutal>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostGotNoti;
