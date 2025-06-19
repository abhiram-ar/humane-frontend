import { API_ROUTES } from "@/lib/API_ROUTES";
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
  const res = await api.patch<UpdateUserCoverPhotoResponse>(
    `${API_ROUTES.USER_SERVICE}/profile/cover-photo`,
    {
      newCoverPhotoKey: newKey,
    },
  );
  return res.data;
};
