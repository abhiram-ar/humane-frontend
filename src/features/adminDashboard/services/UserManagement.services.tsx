import { UserListResponse, UserToggleBlockResponse } from "../types/userManagement.types";
import { adminApi } from "@/lib/axios.adminInstance";

export const fetchUsers = async (search: string, page: number, limit: number) => {
  const response = await adminApi.get<UserListResponse>("/api/v1/admin/manage/user/list", {
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
  const res = await adminApi.patch<UserToggleBlockResponse>(
    "/api/v1/admin/manage/user/block-status",
    {
      newBlockStatus,
      userId,
    },
  );
  return res.data;
};
