import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../services/updateUserProfile.service";
import { FetchUserProfileResponse } from "../pages/CurrentUserProfilePage";

const useMutateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-profile"],
        (oldData: FetchUserProfileResponse["data"]["profile"]) => {
          return {
            ...oldData,
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
          };
        },
      );
    },
  });
};

export default useMutateUserProfile;
