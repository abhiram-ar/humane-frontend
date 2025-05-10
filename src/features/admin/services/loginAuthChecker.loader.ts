import { redirect } from "react-router";
import axios from "axios";
import { store } from "@/app/store/store";
import { setAppLoadingState } from "@/app/store/appSlice";
import { jwtDecode } from "jwt-decode";
import { setAdminCredentials } from "@/features/admin/redux/adminAuthSlice";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";

export const adminLoginAuthChekerLoader = async () => {
  const token = store.getState().adminAuth.token;
  if (!token) {
    try {
      const res = await axios.get("http://localhost/api/v1/global/auth/refresh", {
        withCredentials: true,
      });

      if (res.data.data?.token) {
        const decoded: JWTAuthPayload = jwtDecode(res.data.data.token);
        if (decoded.type === "admin") {
          store.dispatch(setAdminCredentials({ token: res.data.data.token }));
          return redirect("/admin/dashboard");
        } else {
          throw new Error("Admin trying to login with user credentials");
        }
      }

      console.log("On load refresh token succes but no token in response", res);
      return null; // something wrong with the refresh api
    } catch (error) {
      console.log("No admin session while cold start api fetch", error);

      return null; // possibly no refresh token
    } finally {
      store.dispatch(setAppLoadingState(false));
    }
  }

  store.dispatch(setAppLoadingState(false));
  return redirect("/admin/dashboard"); // token alreay exists
};
