import NumberFlow from "@number-flow/react";
import OverviewCard from "./base/OverviewCard";
import { NewSignupsChart } from "./NewSignupsChat";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";

type GetUserStatsResponse = {
  data: {
    logins: {
      usersLoggedInLast24hrs: number;
      usersLoggedInLast48hrs: number;
    };
    totalUsers: {
      totalUsersLastMonth: number;
      currentTotalUsers: number;
    };
    userSingupsInLast6Months: Array<{
      month: string;
      count: number;
    }>;
  };
};

const UserOverviewContainer = () => {
  const { data } = useQuery({
    queryKey: ["users-stat"],
    queryFn: async () => {
      const res = await api.get<GetUserStatsResponse>(
        `${API_ROUTES.ADMIN_ROUTE}/manage/user/stats`,
      );
      return res.data.data;
    },
  });

  const findChange = (currentVale: number, oldValue: number): string => {
    const change = (currentVale - (oldValue || 0)) / (oldValue || 1);
    if (change < 0) return `${change}% decreased`;
    return `${change}% increased`;
  };

  return (
    <>
      <OverviewCard title="New Signups" className="col-span-3">
        <NewSignupsChart data={data?.userSingupsInLast6Months} />
      </OverviewCard>

      <OverviewCard title="Login in last 24hrs">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow
            className="text-2xl font-bold"
            value={data?.logins.usersLoggedInLast24hrs || 0}
          />
          <p className="text-zinc-400">
            {findChange(
              data?.logins.usersLoggedInLast24hrs || 0,
              (data?.logins.usersLoggedInLast48hrs || 0) -
                (data?.logins.usersLoggedInLast24hrs || 0),
            )}{" "}
            from last month
          </p>
        </div>
      </OverviewCard>
      <OverviewCard title="Total users">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow
            className="text-2xl font-bold"
            value={data?.totalUsers.currentTotalUsers || 0}
          />
          <p className="text-zinc-400">
            {findChange(
              data?.totalUsers.currentTotalUsers || 0,
              data?.totalUsers.totalUsersLastMonth || 0,
            )}{" "}
            from last month
          </p>
        </div>
      </OverviewCard>
    </>
  );
};

export default UserOverviewContainer;
