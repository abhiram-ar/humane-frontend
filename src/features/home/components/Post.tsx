import ProfilePicSmall from "@/features/notification/Components/ProfilePicSmall";
import React from "react";
import { Dot, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { formatDistance } from "date-fns";
import AddComment from "./AddComment";
import { HydratedPost } from "../types/GetPostsReponse";

// TODO: split props into post and author and remove uncessay fields
type Props = { postDetails: HydratedPost };
const Post: React.FC<Props> = ({ postDetails }) => {
  const timeAgoString = formatDistance(new Date(postDetails.createdAt), new Date(), {
    addSuffix: true, // Add "ago" or "from now"
  });

  return (
    <div className="flex gap-3 p-4 text-white">
      <div>
        <ProfilePicSmall avatarURL={postDetails.author?.avatarURL} />
      </div>
      <div className="w-full">
        {/* post meta */}
        <div className="flex">
          <Link to="#" className="font-semibold hover:underline">
            {`${postDetails.author?.firstName || "unknown"} ${postDetails.author?.lastName || ""}`}
          </Link>
          <span className="flex text-zinc-400">
            <Dot />
            {postDetails.visibility === "friends" && "Friends only"}
            {postDetails.visibility === "public" && "Public"}
            <Dot />
            {timeAgoString}
          </span>
        </div>

        {/* post content*/}
        <p>{postDetails.content}</p>

        {/* comment */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex w-fit items-center gap-1">
            <MessageSquare className="mt-1" />
            <p>{26}</p>
          </div>
          <AddComment />
        </div>
      </div>
    </div>
  );
};

export default Post;
