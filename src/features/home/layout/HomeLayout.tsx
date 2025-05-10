import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="bg-grey-dark-bg ml-90 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
