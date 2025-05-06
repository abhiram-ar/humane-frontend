import { Outlet } from "react-router";

const AdminDashboardLayout = () => {
  return (
    <div>
      <h2>Admin dashboard</h2>
      <Outlet />
    </div>
  );
};

export default AdminDashboardLayout;
