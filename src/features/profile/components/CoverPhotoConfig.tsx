import CoverPhoto from "./CoverPhoto";
import CoverPhotoUpload from "./CoverPhotoUpload";
import CoverPhotoRemove from "./CoverPhotoRemove";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/fetchUserProfile.service";
import ViewPicture from "./ViewPicture";

const CoverPhotoConfig = () => {
  const { data, isLoading } = useQuery({ queryKey: ["user-profile"], queryFn: fetchUserProfile });

  if (isLoading) return <p>loading</p>;

  return (
    <>
      {data && data.coverPhotoURL ? (
        <div className="group relative flex h-60 w-full flex-col items-center overflow-clip">
          <div className="absolute bottom-2 flex h-15 w-fit translate-y-10 items-center justify-center gap-0 border border-red-500 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:gap-5 group-hover:opacity-100">
            <CoverPhotoRemove />
            <CoverPhotoUpload />
          </div>
          <ViewPicture src={data?.coverPhotoURL} title="Cover photo">
            <button className="h-60 w-full">
              <CoverPhoto url={data?.coverPhotoURL} />
            </button>
          </ViewPicture>
        </div>
      ) : (
        <>
          <div
            title="upload cover photo"
            className="group text-pop-green relative flex h-60 w-full items-center justify-center overflow-clip bg-zinc-500/50"
          >
            <div className="text-center">
              <CoverPhotoUpload />
              <p className="text-zinc-400">upload a cover photo</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CoverPhotoConfig;
