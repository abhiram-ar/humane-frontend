import { api } from "@/lib/axios";
import { EditFormFields } from "../components/EditProfileForm";


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
  const res = await api.patch<UpdateProfileReponse>("/api/v1/anon/profile/", data);
  return res.data.data.profile;
};
