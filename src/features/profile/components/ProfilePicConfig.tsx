import ProfilePic from "./ProfilePic";
import { ImageMinus, ImageUp, ScanEye } from "lucide-react";
import ViewPicture from "./ViewPicture";

const ProfilePicConfig = () => {
  return (
    <div className="">
      <ProfilePic />
      <div className="absolute inset-0 flex h-52 w-52 items-center justify-center rounded-full bg-zinc-900/50 opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
        {/* view image remove and uplod config */}
        <div title="remove photo" className="flex items-center justify-center gap-3 text-white">
          <div className="hover:bg-pop-green scale-90 cursor-pointer rounded-full bg-zinc-600 p-2 transition-all duration-200 ease-out hover:scale-105 hover:text-black">
            <ImageMinus />
          </div>
          <ViewPicture />
          <div
            title="update photo"
            className="hover:bg-pop-green scale-90 cursor-pointer rounded-full bg-zinc-600 p-2 transition-all duration-200 ease-out hover:scale-105 hover:text-black"
          >
            <ImageUp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicConfig;
