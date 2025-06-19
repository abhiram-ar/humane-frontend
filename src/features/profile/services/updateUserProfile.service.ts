import { api } from "@/lib/axios";
import { EditFormFields } from "../components/extended/EditProfileForm";
import { API_ROUTES } from "@/lib/API_ROUTES";

type UpdateProfileReponse = {
  success: boolean;
  message: string;
  data: {
    profile: {
      firstName: string;
      lastName: string;
      bio: string;
    };
  };
};
export const updateUserProfile = async (data: EditFormFields) => {
  const res = await api.patch<UpdateProfileReponse>(`${API_ROUTES.USER_SERVICE}/profile/`, data);
  return res.data.data.profile;
};
