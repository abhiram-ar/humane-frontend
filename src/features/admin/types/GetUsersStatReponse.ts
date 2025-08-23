export type GetUserStatsResponse = {
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
