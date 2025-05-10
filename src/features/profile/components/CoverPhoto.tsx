import testImg from "@/assets/testCover.png";

const CoverPhoto = () => {
  return (
    <div className="max-h-60 max-full border-2 border-green-500 overflow-clip">
      <img className="h-full w-full object-cover" src={testImg} alt="" />
    </div>
  );
};

export default CoverPhoto;
