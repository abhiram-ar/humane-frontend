import { Outlet } from "react-router";
import humanelogo from "./../../../assets/humaneSegoeScriptBold.svg";
const AuthPage = () => {
  return (
    <div className="bg-grey-dark-bg h-screen w-full">
      <div className="grid h-screen grid-cols-2">
        <div className="flex items-center justify-center">
          <div>
            <img src={humanelogo} alt="" />
            <h2 className="-mt-10 text-center font-mono text-white/50">How human are you?</h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
