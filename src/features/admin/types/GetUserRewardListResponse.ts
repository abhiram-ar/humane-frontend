export type Reward = {
  userId: string;
  score: number;
  firstName: string;
  lastName?: string | null;
};

export type Pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
};

export interface GetUsersScoreResponse {
  data: {
    rewards: Reward[];
    pagination: Pagination;
  };
}
