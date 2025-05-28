import { api } from "@/lib/axios";
import { EditFormFields } from "../components/extended/EditProfileForm";

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
  const res = await api.patch<UpdateProfileReponse>("/api/v1/user/profile/", data);
  return res.data.data.profile;
};
