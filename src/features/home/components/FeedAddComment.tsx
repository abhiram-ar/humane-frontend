import { MessageSquare } from "lucide-react";
import React from "react";
import FeedAddCommentForm from "./FeedAddCommentForm";
import { useNavigate } from "react-router";

const FeedAddComment: React.FC<{ postId: string }> = ({ postId }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full gap-3 px-5 pb-4 text-white">
      <div className="mt-3 flex w-full items-center gap-1 ps-10">
        <div className="flex w-fit items-center gap-1 hover:bg-green-subtle hover:text-black cursor-pointer rounded-full px-2 py-1" onClick={() => navigate(`/post/${postId}`)}>
          <MessageSquare size={20} className="mt-1" />
          <p>{26}</p>
        </div>
        <FeedAddCommentForm postId={postId} />
      </div>
    </div>
  );
};

export default FeedAddComment;
