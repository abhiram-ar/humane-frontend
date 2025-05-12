import testProfile from "@/assets/testProfile.png";

type Props = {
  url: string;
};
const ProfilePic: React.FC<Props> = ({ url = testProfile }) => {
  return (
    <div className="h-52 w-52 border border-blue-600">
      <img
        src={`https://d4pllizvq43wd.cloudfront.net/${url}`}
        className="border-grey-light h-full w-full rounded-full border-3 object-cover"
        alt=""
      />
    </div>
  );
};

export default ProfilePic;
