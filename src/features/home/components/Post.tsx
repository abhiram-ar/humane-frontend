import ProfilePicSmall from "@/features/notification/Components/ProfilePicSmall";
import React from "react";
import { Dot } from "lucide-react";
import { useNavigate } from "react-router";
import { formatDistance } from "date-fns";
import { HydratedPost } from "../types/GetPostsReponse";
import PosterImage from "./PosterImage";

// TODO: split props into post and author and remove uncessay fields
type Props = { postDetails: HydratedPost };

const Post: React.FC<Props> = ({ postDetails }) => {
  const navigate = useNavigate();
  const timeAgoString = formatDistance(new Date(postDetails.createdAt), new Date(), {
    addSuffix: true, // Add "ago" or "from now"
  });

  return (
    <div className="flex gap-3 px-4 pt-4 text-white">
      <div className="cursor-pointer" onClick={() => navigate(`/user/${postDetails.authorId}`)}>
        <ProfilePicSmall avatarURL={postDetails.author?.avatarURL} />
      </div>
      <div className="w-full">
        {/* post meta */}
        <div className="flex">
          <div
            onClick={() => navigate(`/user/${postDetails.authorId}`)}
            className="cursor-pointer font-semibold hover:underline"
          >
            {`${postDetails.author?.firstName || "unknown"} ${postDetails.author?.lastName || ""}`}
          </div>
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

        {postDetails.posterURL && <PosterImage className="mt-2" url={postDetails.posterURL} />}
      </div>
    </div>
  );
};

export default Post;
