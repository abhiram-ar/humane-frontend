import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";

const HomeLayout = () => {
  const { ref } = useScrollContext();
  return (
    <div>
      <Sidebar />
      <div ref={ref} className="bg-grey-dark-bg ml-90 h-screen min-h-screen overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
