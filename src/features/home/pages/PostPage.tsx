import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import Post from "../components/Post";
import PostAddComment from "../components/PostAddComment";
import useFullPostDetailsQuery from "../hooks/useFullPostDetailsQuery";
import PageNotFoundPage from "@/layout/PageNotFoundPage";
import Spinner from "@/components/Spinner";
import PostCommentsList from "../components/PostCommentsList";
import useRestoreScrollPosition from "@/hooks/useRestoreScrollPosition";
import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";

const PostPage = () => {
  useRestoreScrollPosition();
  const { setScroll } = useScrollContext();

  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { postId } = useParams<{ postId: string }>();

  const { data, isError } = useFullPostDetailsQuery(postId as string, state?.navigatedPostData);

  if (isError) return <PageNotFoundPage message="Post does not exist" />;

  return (
    <div className="flex min-h-screen border-zinc-400/50 xl:border-s">
      <div className="relative mx-auto w-200 border-x border-zinc-400/50">
        {/* sticky bar */}
        <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 border-b border-zinc-400/50 px-3 py-5 text-xl backdrop-blur-lg">
          <div className="item-center relative flex gap-2">
            <div
              className="absolute cursor-pointer rounded-full p-1 hover:bg-zinc-400/50"
              onClick={() => {
                setScroll(pathname);
                navigate(-1);
              }}
            >
              <ArrowLeft className="" />
            </div>
            <span className="w-8"></span>
            <p className="">Post</p>
          </div>
        </div>

        {data ? (
          <>
            <div className="border-b border-b-zinc-400/50 pb-4">
              <Post postDetails={data.post} />
            </div>

            <div className="border-b border-zinc-400/50">
              {/* dont use postId from browser params as it can be invalid */}
              <PostAddComment postId={data?.post.id} />
            </div>
            <div>
              <PostCommentsList postId={data?.post.id} />
            </div>
          </>
        ) : (
          <div className="mt-5">
            <Spinner />
          </div>
        )}
      </div>

      {/* dummy for centering */}
      <div className="xl:w-90"></div>
    </div>
  );
};
export default PostPage;
