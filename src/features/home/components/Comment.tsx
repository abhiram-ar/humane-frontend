import ProfilePicSmall from "@/components/ProfilePicSmall";
import React from "react";
import { AuthorHydratedComment } from "../types/GetPostComments.types";
import { Dot } from "lucide-react";
import { formatDistance } from "date-fns";
import { useNavigate } from "react-router";

const Comment: React.FC<{ comment: AuthorHydratedComment }> = ({ comment }) => {
  const navigate = useNavigate();
  const timeAgoString = formatDistance(new Date(comment.createdAt), new Date(), {
    addSuffix: true, // Add "ago" or "from now"
  });
  return (
    <div>
      <div className="flex text-white gap-3 ">
        <div>
          <ProfilePicSmall avatarURL={comment.author?.avatarURL} />
        </div>

        <div>
          <div className="flex">
            <div
              onClick={() => navigate(`/user/${comment.authorId}`)}
              className="cursor-pointer font-semibold hover:underline"
            >
              {`${comment.author?.firstName || "unknown"} ${comment.author?.lastName || ""}`}
            </div>
            <span className="flex text-zinc-400">
              <Dot />
              {timeAgoString}
            </span>
          </div>
          <p>{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
