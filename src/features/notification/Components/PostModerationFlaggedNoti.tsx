import { Link } from "react-router";
import ButtonNeutal from "@/components/ButtonNeutal";
import { PostModerationFlaggedNotification } from "../Types/PostModerationFlaggedNotification.entity";

type Props = {
  noti: PostModerationFlaggedNotification;
};
const PostModerationFlaggedNoti: React.FC<Props> = ({ noti }) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-zinc-400/50 px-6 py-5`}
    >
      <div className="flex items-center gap-3">
        <div className="text-white">
          <p className="mb-1">Your post has been flagged by moderation review.</p>
          <p>It may violate our community guidelines.</p>
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

export default PostModerationFlaggedNoti;
