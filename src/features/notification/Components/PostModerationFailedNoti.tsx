import { Link } from "react-router";
import ButtonNeutal from "@/components/ButtonNeutal";
import { PostModerationFailedNotification } from "../Types/PostModerationFailedNotification.entity";

type Props = {
  noti: PostModerationFailedNotification;
};
const PostModerationFailedNoti: React.FC<Props> = ({ noti }) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-zinc-400/50 px-6 py-5`}
    >
      <div className="flex items-center gap-3">
        <div className="text-white">
          <p className="mb-1">Your post failed to complete moderation review.</p>
          <p>Please try uploading your post again.</p>
        </div>
      </div>
      <div>
        {noti.entityId && (
          <Link to={`/post/${noti.entityId}`}>
            <ButtonNeutal>View</ButtonNeutal>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostModerationFailedNoti;
