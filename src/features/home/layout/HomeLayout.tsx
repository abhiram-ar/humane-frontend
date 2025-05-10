import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="bg-grey-dark-bg ml-72 min-h-screen px-10 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
