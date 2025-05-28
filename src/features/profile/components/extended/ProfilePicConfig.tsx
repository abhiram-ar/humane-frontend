import ProfilePic from "../base/ProfilePic";
import ViewPicture from "../base/ViewPicture";
import RemoveProfilePicture from "./RemoveProfilePicture";
import UploadProfilePic from "./UploadProfilePic";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../../services/fetchUserProfile.service";

const ProfilePicConfig = () => {
  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });

  return (
    <div className="relative">
      {data?.avatarURL ? (
        <>
          <ProfilePic url={data?.avatarURL} />
          <div className="absolute z-20 inset-0 flex h-52 w-52 items-center justify-center rounded-full bg-zinc-900/50 opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
            {/* view image remove and uplod config */}
            <div className="flex items-center justify-center gap-3 text-white">
              <RemoveProfilePicture />
              <ViewPicture src={data.avatarURL} title="View Profile photo" />
              <UploadProfilePic />
            </div>
          </div>
        </>
      ) : (
        <div className="border-grey-light flex h-52 w-52 items-center justify-center rounded-full border-3 bg-zinc-600">
          <div className="text-center">
            <div className="text-pop-green scale-125">
              <UploadProfilePic />
            </div>
            <p className="-mb-5 text-zinc-400">upload profile pic</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicConfig;
