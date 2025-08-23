export type GetPostStatsResponse = {
  data: {
    newPosts: {
      newPostInLast24hrs: number;
      newPostInLast48hrs: number;
    };
    totalPosts: number;
  };
};
