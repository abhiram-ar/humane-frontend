export type GetPlatformRewardStatsResponse = {
  data: {
    chatRewards: {
      inLast24hrs: number;
      inLast48hrs: number;
    };
    postRewards: {
      inLast24hrs: number;
      inLast48hrs: number;
    };
    totalRewards: {
      total: number;
      inLast24hrs: number;
      inLast48hrs: number;
    };
  };
};
