export type InfiniteScrollParams = {
  hasMore: boolean;
  cursor: number | null;
};

export type InfiniteScrollResponse = {
  success: boolean;
  message: string;
  data: {
    scroll: InfiniteScrollParams;
    users: {
      id: string;
      firstName: string;
      lastName: string | null;
      avatarURL: string | null;
    }[];
  };
};
