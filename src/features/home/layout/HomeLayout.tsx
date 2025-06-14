import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="bg-grey-dark-bg ml-90 h-screen min-h-screen overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
