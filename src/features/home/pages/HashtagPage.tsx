import useRestoreScrollPosition from "@/hooks/useRestoreScrollPosition";
import { useParams } from "react-router";
import HashtagPostList from "../components/HashtagPostList";
import PageNotFoundPage from "@/layout/PageNotFoundPage";

const HashtagPage = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  useRestoreScrollPosition();

  if (!hashtag) return <PageNotFoundPage message="Hashtag Not found" />;

  return (
    <div className="flex min-h-screen border-zinc-400/50 xl:border-s">
      <div className="relative mx-auto w-200 border-x border-zinc-400/50">
        <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 border-b border-zinc-400/50 py-5 text-center text-xl backdrop-blur-lg">
          #{hashtag}
        </div>

        <HashtagPostList hashtag={hashtag} />
      </div>

      {/* dummy for centering */}
      <div className="xl:w-90"></div>
    </div>
  );
};
export default HashtagPage;
