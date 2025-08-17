import { MessageSquare } from "lucide-react";
import React from "react";
import FeedAddCommentForm from "./FeedAddCommentForm";
import { useLocation, useNavigate } from "react-router";
import { HydratedPost } from "../types/GetPostsReponse";
import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";

const FeedAddComment: React.FC<{ post: HydratedPost; disabled?: boolean }> = ({
  post,
  disabled = false,
}) => {
  const { setScroll } = useScrollContext();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="w-full gap-3 px-5 pb-4 text-white">
      {!disabled && (
        <div className="mt-3 flex w-full items-center gap-1 ps-10">
          <div
            className="hover:bg-green-subtle flex w-fit cursor-pointer items-center gap-1 rounded-full px-2 py-1 hover:text-black"
            onClick={() => {
              setScroll(location.pathname);
              navigate(`/post/${post.id}`, { state: { navigatedPostData: post } });
            }}
          >
            <MessageSquare size={20} className="mt-1" />
            <p>{post.commentCount ?? ""}</p>
          </div>
          <FeedAddCommentForm postId={post.id} />
        </div>
      )}
    </div>
  );
};

export default FeedAddComment;
