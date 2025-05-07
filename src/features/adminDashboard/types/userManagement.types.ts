export type User = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  isBlocked: boolean;
  isHotUser: boolean;
  createdAt: string;
  humaneScore: number;
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

export interface UserToggleBlockResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
