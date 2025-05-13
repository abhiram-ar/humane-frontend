import CoverPhoto from "./CoverPhoto";
import CoverPhotoUpload from "./CoverPhotoUpload";
import CoverPhotoRemove from "./CoverPhotoRemove";

const CoverPhotoConfig = () => {
  return (
    <div className="group relative h-60 w-full overflow-clip flex flex-col items-center">
      <div className="absolute w-fit bottom-2 flex h-15 translate-y-10 items-center justify-center gap-0 border border-red-500 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:gap-5 group-hover:opacity-100">
        <CoverPhotoRemove />
        <CoverPhotoUpload />
      </div>
      <div className="h-60 w-full bg-red-300" onClick={() => console.log("clic")}>
        <CoverPhoto />
      </div>
    </div>
  );
};

export default CoverPhotoConfig;
