import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import { logoutAdmin } from "@/features/userAuth/redux/adminAuthSlice";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router";

const AdminHomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAdminlogout = async () => {
    try {
      await api.post("/api/v1/admin/auth/logout");
      dispatch(logoutAdmin());
      navigate("/admin/login");
    } catch (error) {
      console.log("error while logging out admin", error);
    }
  };
  return (
    <div>
      <h2>Admin home metrics</h2>
      <button className="border bg-red-200 px-5 py-2 hover:bg-red-400" onClick={handleAdminlogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminHomePage;
