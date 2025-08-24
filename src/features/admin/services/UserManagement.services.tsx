import { API_ROUTES } from "@/lib/API_ROUTES";
import { UserListResponse, UserToggleBlockResponse } from "../types/userManagement.types";
import { api } from "@/lib/axios";

export const fetchUsers = async (search: string, page: number, limit: number) => {
  const response = await api.get<UserListResponse>("/api/v1/admin/manage/user/list", {
    params: { search, page, limit },
  });
  return response.data;
};

export const updateUserBlockStatus = async ({
  newBlockStatus,
  userId,
}: {
  newBlockStatus: boolean;
  userId: string;
}) => {
  const res = await api.patch<UserToggleBlockResponse>(
    `${API_ROUTES.ADMIN_ROUTE}/manage/user/block-status`,
    {
      newBlockStatus,
      userId,
    },
  );
  return res.data;
};
