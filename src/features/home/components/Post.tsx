import ProfilePicSmall from "@/components/ProfilePicSmall";
import React from "react";
import { Dot } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { formatDistance } from "date-fns";
import { HydratedPost } from "../types/GetPostsReponse";
import PosterImage from "./PosterImage";
import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";

// TODO: split props into post and author and remove uncessay fields
type Props = { postDetails: HydratedPost; enablePosterLink?: boolean };

const Post: React.FC<Props> = ({ postDetails, enablePosterLink = false }) => {
  const { setScroll } = useScrollContext();
  const location = useLocation();
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
            onClick={() => {
              setScroll(location.pathname);
              navigate(`/user/${postDetails.authorId}`);
            }}
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

        {postDetails.attachmentURL && (
          <div
            className={`${enablePosterLink ? "cursor-pointer" : ""}`}
            onClick={() => {
              if (enablePosterLink) {
                setScroll(location.pathname);
                navigate(`/post/${postDetails.id}`, { state: { navigatedPostData: postDetails } });
              }
            }}
          >
            {postDetails.attachmentType?.toLowerCase().startsWith("image") && (
              <PosterImage className="mt-2" url={postDetails.attachmentURL} />
            )}
            {postDetails.attachmentType?.toLowerCase().startsWith("video") && (
              <div className="mt-2">
                <VideoPlayer
                  src={postDetails.attachmentURL}
                  autoplay={true}
                  mimeType={postDetails.attachmentType}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
