import { useNavigate } from "react-router";
import Login from "../components/Login";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { useAppDispatch } from "../hooks/store.hooks";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { setCredentials } from "../redux/userAuthSlice";
import { jwtDecode } from "jwt-decode";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";

type AdminLoginResponse = {
  data: {
    accessToken: string;
  };
};

const AdminLoginPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await api.post<AdminLoginResponse>(`${API_ROUTES.ADMIN_ROUTE}/auth/login`, data);

      const token = res.data.data.accessToken;
      const decoded: JWTAuthPayload = jwtDecode(res.data.data.accessToken);
      dispath(setCredentials({ token, type: decoded.type }));

      // dont want authicated uses to come back to login page
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // rethrow the error for the calling funcion,
        // to show field errors
        throw error;
      } else {
        console.log("Error while user login", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-offwhite mb-3 text-center text-2xl font-semibold">Admin Login</h2>
      <Login handleLogin={handleLogin} showGoogleAuth={false} showForgotPassword={false} />
    </div>
  );
};

export default AdminLoginPage;
