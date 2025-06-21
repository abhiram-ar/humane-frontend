import { Heart } from "lucide-react";
import React from "react";

type Props = {
  likeCount?: number;
  likedByUser?: boolean;
  hasPostAuthorLiked?: boolean;
};
const CommentLike: React.FC<Props> = ({ likeCount, likedByUser }) => {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="cursor-pointer rounded-full p-1 hover:bg-zinc-400/50">
        <Heart
          size={15}
          className={`text-white ${likedByUser ? "stroke-red-blood fill-red-500" : ""}`}
        />
      </div>
      <p className="text-sm text-zinc-400">{likeCount ?? likeCount}</p>
    </div>
  );
};

export default CommentLike;
