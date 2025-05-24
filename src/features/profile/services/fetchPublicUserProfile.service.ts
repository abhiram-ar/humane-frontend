import { api } from "@/lib/axios";
import { GetPublicUserProfileResponse } from "../Types/GetPublicUserProfileResponse";


export const getPublicUserProfie = async (userId: string) => {
  const res = await api.get<GetPublicUserProfileResponse>(`/api/v1/query/public/user/${userId}`, {
    validateStatus: (status) => status < 500,
  });
  return res;
};
