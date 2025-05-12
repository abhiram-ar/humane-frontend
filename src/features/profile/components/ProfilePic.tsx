import testProfile from "@/assets/testProfile.png";

type Props = {
  url: string;
};
const ProfilePic: React.FC<Props> = ({ url }) => {
  return (
    <div className="border-grey-light h-52 w-52 overflow-hidden rounded-full border-3 bg-zinc-400">
      <img src={url} className="h-full w-full object-cover" alt="" />
    </div>
  );
};

export default ProfilePic;
