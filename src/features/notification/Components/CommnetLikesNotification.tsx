import React from "react";
import { CommentLikesNotification } from "../Types/CommentLikesNotification";
import { Link } from "react-router";
import ButtonNeutal from "@/components/ButtonNeutal";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import { shimmer } from "@/constants/shimmerStyle";

type Props = {
  noti: CommentLikesNotification;
};
const CommnetLikesNotification: React.FC<Props> = ({ noti }) => {
  const mostRecentLikerId = noti.metadata.recentLikes.at(-1)?.userId;
  const { user: recentLiker } = usePublicUserProfileQuery(mostRecentLikerId);

  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-zinc-400/50 px-6 py-5`}
    >
      <div className="flex items-center gap-3">
        <div className="text-white">
          {mostRecentLikerId && (
            <>
              <p>
                {recentLiker ? (
                  <Link
                    to={`/user/${recentLiker.id}`}
                    className="text-green-subtle hover:underline"
                  >
                    {`${recentLiker.firstName} ${recentLiker.lastName || ""}`}
                  </Link>
                ) : (
                  <span className={`${shimmer}`}>..............</span>
                )}
                {noti.metadata.likeCount > 1 && <span> and {noti.metadata.likeCount} other</span>}{" "}
                liked your comment
              </p>
            </>
          )}
          {!mostRecentLikerId && <p>{noti.metadata.likeCount} person liked your comment</p>}
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

export default CommnetLikesNotification;
