import { updateUserAvatarPhoto } from "../services/updateUserAvatarPhoto.service";
import { FetchUserProfileResponse } from "../services/fetchUserProfile.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutateUserAvatarPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserAvatarPhoto,
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], (oldData: FetchUserProfileResponse) => {
        if (oldData) {
          return { ...oldData, avatarURL: data.data.avatarURL };
        }

        return oldData;
      });
    },
  });
};

export default useMutateUserAvatarPhoto;
