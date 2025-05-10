import CoverPhoto from "../components/CoverPhoto";
import EditProfileButton from "../components/EditProfileButton";
import ProfilePic from "../components/ProfilePic";

const CurrentUserProfilePage = () => {
  return (
    <div className="h-screen border border-red-300 xl:me-90">
      <CoverPhoto />
      <div className="">
        <ProfilePic />
        <EditProfileButton />
      </div>
    </div>
  );
};

export default CurrentUserProfilePage;
