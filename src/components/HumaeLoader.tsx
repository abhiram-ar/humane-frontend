import humanelogo from "@/assets/humaneSegoeScriptBold.svg";

const HumaeLoader = () => {
  return (
    <div className="bg-grey-dark-bg flex h-screen w-full items-center justify-center">
      <div className="animate-pulse">
        <img src={humanelogo} alt="" />
      </div>
    </div>
  );
};

export default HumaeLoader;
