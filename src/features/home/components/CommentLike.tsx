import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import React from "react";

type Props = {
  commentId: string;
  likeCount?: number;
  hasLikedByUser?: boolean;
  hasPostAuthorLiked?: boolean;
};

type LikeCommentResponse = {
  data: {
    like: {
      id: string;
      authorId: string;
      commentId: string;
    };
  };
};

const CommentLike: React.FC<Props> = ({ likeCount, hasLikedByUser, commentId }) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await api.post<LikeCommentResponse>(
        `${API_ROUTES.POST_SERVICE}/comment/${commentId}/like`,
      );
      return res.data.data;
    },
  });

  const handleLikeClick = () => {
    mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div
        className="cursor-pointer rounded-full p-1 hover:bg-zinc-400/50"
        onClick={() => handleLikeClick()}
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
