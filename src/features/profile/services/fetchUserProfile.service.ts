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
      humaneScore: number;
    };
  };
};
export const fetchUserProfile = async () => {
  const res = await api.get<FetchUserProfileResponse>("/api/v1/user/profile/");
  return res.data.data.profile;
};
