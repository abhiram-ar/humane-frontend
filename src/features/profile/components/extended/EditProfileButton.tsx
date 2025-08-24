import EditProfileForm, { EditFormFields } from "./EditProfileForm";
import React, { useRef } from "react";
import useMutateUserProfile from "../../hooks/useMutateUserProfile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  nameAndBio: {
    firstName: string;
    lastName?: string;
    bio?: string;
  };
};

const EditProfileButton: React.FC<Props> = (props) => {
  const { mutate: mutateUserProfile } = useMutateUserProfile();

  const closeDialogRef = useRef(null);

  const handleEditProfile = async (data: EditFormFields): Promise<void> => {
    return new Promise((resolve, reject) => {
      mutateUserProfile(data, {
        onSuccess: () => {
          // this onSuccess will run after the onSucess callback defined in the global mutation
          if (closeDialogRef.current) {
            (closeDialogRef.current as HTMLButtonElement).click();
          }
          resolve();
        },
        onError: (err) => reject(err), // throw back the error for the calling form handler to show field errors
      });
    });
  };

  const CloseButtonComponent = ({ children }: { children: React.ReactNode }) => (
    <DialogClose>{children}</DialogClose>
  );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="rounded-2xl border border-black bg-zinc-500 px-5 py-1 font-semibold text-black transition-all duration-100 ease-out hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700">
            Edit profile
          </button>
        </DialogTrigger>
        <DialogContent className="border-grey-dark-bg bg-[#272727]" aria-describedby="edit profile">
          <DialogHeader>
            <DialogTitle className="text-almost-white">Edit profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm
            CloseElem={CloseButtonComponent}
            {...props}
            handleEditProfile={handleEditProfile}
          />
          <DialogClose ref={closeDialogRef} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileButton;
