import OverviewCard from "../components/base/OverviewCard";
import UserOverviewContainer from "../components/UserOverviewContainer";

const AdminHomePage = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-400">Overview</h2>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {/* users */}
        <UserOverviewContainer />

        {/* post related */}
        <OverviewCard title="Total posts">
          <p className="h-20">Hi</p>
        </OverviewCard>
        <OverviewCard title="Avg. Comments/post/month">
          <p className="h-20">Hi</p>
        </OverviewCard>
        <OverviewCard title="User Reports">
          <p className="h-20">Hi</p>
        </OverviewCard>
        <OverviewCard title="Total post rewards">
          <p className="h-20">Hi</p>
        </OverviewCard>
        {/* chat */}
        <OverviewCard title="Total chat rewards">
          <p className="h-20">Hi</p>
        </OverviewCard>
        <OverviewCard title="Total Rewards">
          <p className="h-20">Hi</p>
        </OverviewCard>
      </div>

      {/* // total users

      // login in last 24 

      // singups ins last 24hrs

      // users online */}

      {/* // total post

      // reports count */}

      {/* // total post rewards

      // total chat rewards */}
    </div>
  );
};

export default AdminHomePage;
