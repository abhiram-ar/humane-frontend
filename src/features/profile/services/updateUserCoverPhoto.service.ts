import { api } from "@/lib/axios";

export type UpdateUserCoverPhotoResponse = {
  success: boolean;
  message: string;
  data: {
    coverPhotoKey: string;
    coverPhotoURL: string;
  };
};
export const updateUserCoverPhoto = async (newKey: string) => {
  const res = await api.patch<UpdateUserCoverPhotoResponse>("/api/v1/user/profile/cover-photo", {
    newCoverPhotoKey: newKey,
  });
  return res.data;
};
