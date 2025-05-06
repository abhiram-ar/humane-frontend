import { Outlet } from "react-router";
import humanelogo from "./../../../assets/humaneSegoeScriptBold.svg";

const AdminAuthLayout = () => {
  return (
    <div className="h-screen w-full bg-red-950">
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
