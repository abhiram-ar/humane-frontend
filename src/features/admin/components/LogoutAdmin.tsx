import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import { logoutAdmin } from "@/features/admin/redux/adminAuthSlice";
import { api } from "@/lib/axios";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const LogoutAdmin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("/api/v1/admin/auth/logout");
      dispatch(logoutAdmin());
      navigate("/admin/login");
    } catch (error) {
      console.log("erorr while loggint out admin", error);
    }
  };

  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-3 rounded-e-xl px-6 py-3 transition-all duration-500 ease-out hover:bg-zinc-700/50"
    >
      <LogOut className="rotate-180" />
      <button>Logout</button>
    </div>
  );
};

export default LogoutAdmin;
