import { api } from "@/lib/axios";
import { GetPublicUserProfileResponse } from "../Types/GetPublicUserProfileResponse";
import { API_ROUTES } from "@/lib/API_ROUTES";

export const getPublicUserProfie = async (userId: string) => {
  const res = await api.get<GetPublicUserProfileResponse>(
    `${API_ROUTES.QUERY_SERVICE}/public/user/${userId}`,
    {
      validateStatus: (status) => status < 500,
    },
  );
  return res;
};
