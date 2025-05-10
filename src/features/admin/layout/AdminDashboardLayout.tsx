import Sidebar from "@/features/admin/components/Sidebar";
import { Outlet } from "react-router";

const AdminDashboardLayout = () => {
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div className="bg-grey-dark-bg ml-72 min-h-screen py-8 px-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
