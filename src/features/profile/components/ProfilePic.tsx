import testProfile from "@/assets/testProfile.png";

const ProfilePic = () => {
  return (
    <div  className="border border-blue-600 w-60 h-60">
      <img src={testProfile} className="w-full h-full object-cover rounded-full border-3 border-grey-light" alt="" />
    </div>
  );
};

export default ProfilePic;
