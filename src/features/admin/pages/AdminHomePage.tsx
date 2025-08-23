import PostOverviewContainer from "../components/PostOverviewContainer";
import RewardOverviewContainer from "../components/RewardOverviewContainer";
import UserOverviewContainer from "../components/UserOverviewContainer";
import UsersOnlineOverviewCard from "../components/UsersOnlineOverviewCard";

const AdminHomePage = () => {
  return (
    <div>
      <h2 className="text-almost-white mb-5 font-sans text-2xl font-semibold">Overview</h2>
      <div className="grid grid-cols-3 gap-3">
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
