import { Outlet } from "react-router";
import humanelogo from "./../../../assets/humaneSegoeScriptBold.svg";

const AdminAuthLayout = () => {
  return (
    <div className="bg-red-950 h-screen w-full">
      <div className="grid h-screen grid-cols-2">
        <div className="flex items-center justify-center">
          <Outlet />
        </div>
        <div className="flex items-center justify-center">
          <div>
            <img src={humanelogo} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthLayout;
