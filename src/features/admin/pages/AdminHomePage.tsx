import PostOverviewContainer from "../components/PostOverviewContainer";
import RewardOverviewContainer from "../components/RewardOverviewContainer";
import UserOverviewContainer from "../components/UserOverviewContainer";
import UsersOnlineOverviewCard from "../components/UsersOnlineOverviewCard";

const AdminHomePage = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-400">Overview</h2>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {/* users */}
        <UserOverviewContainer />

        {/* realtime-user-stats */}
        <UsersOnlineOverviewCard />

        {/* post related */}
        <PostOverviewContainer />

        {/* reward */}
        <RewardOverviewContainer />
      </div>
    </div>
  );
};

export default AdminHomePage;
