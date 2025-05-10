import CoverPhoto from "../components/CoverPhoto";
import ProfilePic from "../components/ProfilePic";

const CurrentUserProfilePage = () => {
  return (
    <div className="h-screen border border-red-300 xl:me-90">
      <CoverPhoto />
      <ProfilePic />
    </div>
  );
};

export default CurrentUserProfilePage;
