import EditProfileForm, {
  EditFormFields,
} from "@/features/profile/components/extended/EditProfileForm";
import ProfilePicConfig from "@/features/profile/components/extended/ProfilePicConfig";
import useCurrentUserProfile from "@/features/profile/hooks/useCurrentUserProfile";
import useMutateUserProfile from "@/features/profile/hooks/useMutateUserProfile";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const ProfileSettingsPage = () => {
  const { data: profileData } = useCurrentUserProfile();
  const { mutate: mutateUserProfile } = useMutateUserProfile();
  const isMobile = useIsMobile();

  const handleEditProfile = async (data: EditFormFields): Promise<void> => {
    return new Promise((resolve, reject) => {
      mutateUserProfile(data, {
        onSuccess: () => {
          // this onSuccess will run after the onSucess callback defined in the global mutation
          toast.success("Profile updated", { position: "top-right" });
          resolve();
        },
        onError: (err) => reject(err), // throw back the error for the calling form handler to show field errors
      });
    });
  };

  return (
    <>
      {isMobile && (
        <Link to="/settings" className="flex gap-1 ps-5 pt-5 text-white">
          <ArrowLeft />
          <p>Edit Profile</p>
        </Link>
      )}

      <div className="flex flex-col items-center justify-center">
        <div className="mt-10">
          <ProfilePicConfig />
        </div>
        <div className="mt-10 w-2/3 max-w-[40rem]">
          <EditProfileForm
            handleEditProfile={handleEditProfile}
            nameAndBio={{
              firstName: profileData?.firstName ?? "",
              lastName: profileData?.lastName,
              bio: profileData?.bio,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileSettingsPage;
