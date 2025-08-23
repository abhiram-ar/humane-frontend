import OverviewCard from "../components/base/OverviewCard";
import PostOverviewContainer from "../components/PostOverviewContainer";
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
        <OverviewCard title="Total post rewards">
          <p className="h-20">Hi</p>
        </OverviewCard>
        <OverviewCard title="Total chat rewards">
          <p className="h-20">Hi</p>
        </OverviewCard>
        <OverviewCard title="Total Rewards">
          <p className="h-20">Hi</p>
        </OverviewCard>
      </div>
    </div>
  );
};

export default AdminHomePage;
