export type User = {
  id: string;
  firstName: string;
  email: string;
  isBlocked: boolean;
};

export interface IPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: IPagination;
    filter: {
      search?: string;
    };
  };
}
