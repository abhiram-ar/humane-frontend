import { Heart } from "lucide-react";
import React from "react";
import useLikeCommentMutation from "../hooks/useLikeCommentMutation";
import useUnlikeCommentMutation from "../hooks/useUnlikeCommentMutation";

type Props = {
  postId: string;
  postAuthorId: string;
  commentAuthorId: string;
  commentId: string;
  likeCount?: number;
  hasLikedByUser?: boolean;
  hasPostAuthorLiked?: boolean;
};

const CommentLike: React.FC<Props> = ({
  likeCount,
  hasLikedByUser,
  commentId,
  postId,
  postAuthorId,
  commentAuthorId,
}) => {
  const { mutate: likeComment } = useLikeCommentMutation(
    postId,
    commentId,
    commentAuthorId,
    postAuthorId,
  );
  const { mutate: unlikeComment } = useUnlikeCommentMutation(
    postId,
    commentId,
    commentAuthorId,
    postAuthorId,
  );

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div
        className="cursor-pointer rounded-full p-1 hover:bg-zinc-400/50"
        onClick={() => (hasLikedByUser ? unlikeComment(commentId) : likeComment(commentId))}
      >
        <Heart
          size={15}
          className={`text-white ${hasLikedByUser ? "stroke-red-blood fill-red-500" : ""}`}
        />
      </div>
      <div className={`text-sm text-zinc-400 ${!likeCount ? "opacity-0" : ""}`}>
        {likeCount && likeCount}
      </div>
    </div>
  );
};

export default CommentLike;
