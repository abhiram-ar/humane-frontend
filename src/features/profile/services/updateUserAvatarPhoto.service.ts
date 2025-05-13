import { api } from "@/lib/axios";

export type UpdateUserAvatarPhotoResponse = {
  success: boolean;
  message: string;
  data: {
    avatarKey: string;
    avatarURL: string;
  };
};
export const updateUserAvatarPhoto = async (newKey: string) => {
  const res = await api.patch<UpdateUserAvatarPhotoResponse>("/api/v1/anon/profile/avatar", {
    newAvatarKey: newKey,
  });
  return res.data;
};
