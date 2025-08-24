import OverviewCard from "./base/OverviewCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { GetPlatformRewardStatsResponse } from "../types/GetPlatformRewardStatResonse";
import NumberFlow from "@number-flow/react";
import { findChange } from "@/lib/findChange";

const RewardOverviewContainer = () => {
  const { data } = useQuery({
    queryKey: ["admin-reward-stats"],
    queryFn: async () => {
      const res = await api.get<GetPlatformRewardStatsResponse>(
        `${API_ROUTES.REWARD_ROUTE}/platform/stats`,
      );
      return res.data.data;
    },
  });
  return (
    <>
      <OverviewCard title="Post rewarded Amount in last 24hrs">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow className="text-2xl font-bold" value={data?.postRewards.inLast24hrs || 0} />
          <p className="text-zinc-400">
            {findChange(
              data?.postRewards.inLast24hrs || 0,
              (data?.postRewards.inLast48hrs || 0) - (data?.postRewards.inLast24hrs || 0),
            )}{" "}
            from yesterday
          </p>
        </div>
      </OverviewCard>
      <OverviewCard title="Total Rewarded Amount">
        <NumberFlow className="text-2xl font-bold" value={data?.totalRewards.total || 0} />
        <p className="text-zinc-400">
          {findChange(
            data?.totalRewards.inLast24hrs || 0,
            (data?.totalRewards.inLast48hrs || 0) - (data?.totalRewards.inLast24hrs || 0),
          )}{" "}
          from yesterday
        </p>
      </OverviewCard>
      <OverviewCard title="Chat Rewarded Amount in last 24hrs">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow className="text-2xl font-bold" value={data?.chatRewards.inLast24hrs || 0} />
          <p className="text-zinc-400">
            {findChange(
              data?.chatRewards.inLast24hrs || 0,
              (data?.chatRewards.inLast48hrs || 0) - (data?.chatRewards.inLast24hrs || 0),
            )}{" "}
            from yesterday
          </p>
        </div>
      </OverviewCard>
    </>
  );
};

export default RewardOverviewContainer;
