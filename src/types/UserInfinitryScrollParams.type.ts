export type UserListInfinityScollParams = {
  createdAt: string;
  lastId: string;
  hasMore: boolean;
} | null;

export type UserListInfinityScollQueryParams = {
  createdAt?: string;
  lastId?: string;
  size: number;
};
