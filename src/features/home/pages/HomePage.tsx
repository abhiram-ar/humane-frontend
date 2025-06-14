import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";
import PostList from "../components/PostList";

const HomePage = () => {
  const { ref } = useScrollContext();
  console.log("sc", ref);

  return (
    <div className="flex min-h-screen border-zinc-400/50 xl:border-s">
      <div className="relative mx-auto w-200 border-x border-zinc-400/50">
        <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 border-b border-zinc-400/50 py-5 text-center text-xl backdrop-blur-lg">
          #Feed
        </div>

        <PostList />
      </div>

      {/* dummy for centering */}
      <div className="xl:w-90"></div>
    </div>
  );
};
export default HomePage;
