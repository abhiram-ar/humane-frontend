import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import Post from "../components/Post";
import PostAddComment from "../components/PostAddComment";

const post = {
  id: "684b003fc4110a959ca5027c",
  authorId: "5315c3dd-a5bc-4754-9ce7-817018f97f7d",
  content: "Hello world",
  visibility: "friends",
  moderationStatus: "pending",
  moderationMetadata: null,
  createdAt: "2025-06-12T16:28:47.439Z",
  updatedAt: "2025-06-12T16:28:47.439Z",
  posterURL:
    "https://d4pllizvq43wd.cloudfront.net/5315c3dd-a5bc-4754-9ce7-817018f97f7d/1749745727114-Son Goku.jpeg",
  author: {
    id: "5315c3dd-a5bc-4754-9ce7-817018f97f7d",
    firstName: "abhi",
    lastName: "real",
    avatarURL: "https://d4pllizvq43wd.cloudfront.net/profile-pic/1747811634505-nbkrr.png",
  },
};
const PostPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen border-zinc-400/50 xl:border-s">
      <div className="relative mx-auto w-200 border-x border-zinc-400/50">
        {/* sticky bar */}
        <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 border-b border-zinc-400/50 px-3 py-5 text-xl backdrop-blur-lg">
          <div className="item-center relative flex gap-2">
            <div
              className="absolute cursor-pointer rounded-full p-1 hover:bg-zinc-400/50"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="" />
            </div>
            <span className="w-8"></span>
            <p className="">Post</p>
          </div>
        </div>

        <div className="border-b border-b-zinc-400/50 pb-4">
          <Post postDetails={post} />
        </div>

        <div className="flex">
          <PostAddComment postId={post.id} />
        </div>
      </div>

      {/* dummy for centering */}
      <div className="xl:w-90"></div>
    </div>
  );
};
export default PostPage;
