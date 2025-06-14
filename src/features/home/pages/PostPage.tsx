import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import Post from "../components/Post";
import PostAddComment from "../components/PostAddComment";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { HydratedPost } from "../types/GetPostsReponse";

type GetFullPostDetails = {
  message: string;
  data: {
    post: HydratedPost;
  };
};

const PostPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { postId } = useParams<{ postId: string }>();

  const { data } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await api.get<GetFullPostDetails>(`${API_ROUTES.QUERY_SERVICE}/post/${postId}`);
      return res.data.data;
    },
    initialData: { post: state.navigatedPostData as HydratedPost },
  });

  console.log(data);

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
          {data && <Post postDetails={data.post} />}
        </div>

        <div className="flex">
          <PostAddComment postId={data.post.id} />
        </div>
      </div>

      {/* dummy for centering */}
      <div className="xl:w-90"></div>
    </div>
  );
};
export default PostPage;
