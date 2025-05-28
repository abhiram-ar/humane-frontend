import { ImageMinus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useMutateUserAvatarPhoto from "../../hooks/useMutateUserAvatarPhoto";
import { FetchUserProfileResponse } from "../../services/fetchUserProfile.service";
import { useQueryClient } from "@tanstack/react-query";

const RemoveProfilePicture = () => {
  const queryClient = useQueryClient();

  const { mutate: updateUserAvatarPhoto } = useMutateUserAvatarPhoto();

  const handleRemoveProfilePhoto = async () => {
    updateUserAvatarPhoto("", {
      onSuccess: () => {
        queryClient.setQueryData(
          ["user-profile"],
          (oldData: FetchUserProfileResponse["data"]["profile"]) => {
            if (oldData) {
              return {
                ...oldData,
                avatarURL: null, // global behavior set the response of the mutation as URL, which is just the CDN link
              };
            }
            return oldData;
          },
        );
      },
    });
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="hover:bg-pop-green scale-90 cursor-pointer rounded-full bg-zinc-600 p-2 transition-all duration-200 ease-out hover:scale-105 hover:text-black">
            <ImageMinus />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove profile picture?</AlertDialogTitle>
            <AlertDialogDescription>You cannot undo this action.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveProfilePhoto}
              className="bg-red-blood cursor-pointer rounded-2xl ease-out hover:bg-red-800"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RemoveProfilePicture;
