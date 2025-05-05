import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { logout } from "@/features/userAuth/redux/userAuthSlice";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router";

const HomePage = () => {
  const token = useAppSelector((state) => state.userAuth.token);
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const handleLogut = async () => {
    try {
      await api.post("/api/v1/user/auth/logout");
      dispath(logout());
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("error while logging out", error);
    }
  };

  return (
    <div>
        <p className="text-white">User Protected route</p>
      <p>user token: {token}</p>
      <button onClick={handleLogut} className="border-2 bg-green-100 p-2 px-5 hover:bg-green-300">
        logut
      </button>
    </div>
  );
};
export default HomePage;
