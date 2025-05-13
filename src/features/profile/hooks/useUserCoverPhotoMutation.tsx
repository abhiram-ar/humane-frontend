import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FetchUserProfileResponse } from "../services/fetchUserProfile.service";
import { updateUserCoverPhoto } from "../services/updateUserCoverPhoto.service";

const useUserCoverPhotoMutation = () => {
     const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserCoverPhoto,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user-profile"],
        (oldData: FetchUserProfileResponse["data"]["profile"]) => {
          if (oldData) {
            return {
              ...oldData,
              coverPhotoURL: data.data.coverPhotoURL,
            } as FetchUserProfileResponse["data"]["profile"];
          }
          return oldData;
        },
      );
    },
  });
}

export default useUserCoverPhotoMutation
