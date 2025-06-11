import Post from "../components/Post";

const HomePage = () => {
  return (
    <div className="flex border-zinc-400/50 xl:border-s">
      <div className="relative mx-auto w-200 border-x border-zinc-400/50">
        <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 p-8 text-center text-xl backdrop-blur-2xl">
          #Feed
        </div>

        <div className="h-500 border border-red-300">

          <Post />
        </div>
      </div>

      {/* dummy for centering */}
      <div className="xl:w-90"></div>
    </div>
  );
};
export default HomePage;
