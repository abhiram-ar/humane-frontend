import { API_ROUTES } from "@/lib/API_ROUTES";
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
  const res = await api.patch<UpdateUserAvatarPhotoResponse>(
    `${API_ROUTES.USER_SERVICE}/profile/avatar`,
    {
      newAvatarKey: newKey,
    },
  );
  return res.data;
};
