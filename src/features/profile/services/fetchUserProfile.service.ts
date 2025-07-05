import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";

export type FetchUserProfileResponse = {
  success: boolean;
  message: string;
  data: {
    profile: {
      firstName: string;
      lastName?: string;
      bio?: string;
      avatarURL?: string;
      coverPhotoURL?: string;
      createdAt: string;
    };
  };
};
export const fetchUserProfile = async () => {
  const res = await api.get<FetchUserProfileResponse>(`${API_ROUTES.USER_SERVICE}/profile/`);
  return res.data.data.profile;
};
