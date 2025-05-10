import testImg from "@/assets/testCover.png";

const CoverPhoto = () => {
  return (
    <div className="max-full max-h-60 overflow-clip border-2 border-green-500">
      <img className="h-full w-full object-cover" src={testImg} alt="" />
    </div>
  );
};

export default CoverPhoto;
