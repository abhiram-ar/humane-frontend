import ProfilePic from "./ProfilePic";
import ViewPicture from "./ViewPicture";
import testImg from "@/assets/testProfile.png";
import RemoveProfilePicture from "./RemoveProfilePicture";
import UploadProfilePic from "./UploadProfilePic";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/fetchUserProfile.service";

const ProfilePicConfig = () => {
  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });

  return (
    <div className="">
      <ProfilePic url={data?.avatarId} />
      <div className="absolute inset-0 flex h-52 w-52 items-center justify-center rounded-full bg-zinc-900/50 opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
        {/* view image remove and uplod config */}
        <div title="remove photo" className="flex items-center justify-center gap-3 text-white">
          <RemoveProfilePicture />
          <ViewPicture src={testImg} />
          <UploadProfilePic />
        </div>
      </div>
    </div>
  );
};

export default ProfilePicConfig;
