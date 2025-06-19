import { redirect } from "react-router";
import axios from "axios";
import { store } from "@/app/store/store";
import { setAppLoadingState } from "@/app/store/appSlice";
import { jwtDecode } from "jwt-decode";
import { setAdminCredentials } from "@/features/admin/redux/adminAuthSlice";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";

export const isAdminAuthenticatedLoader = async () => {
  const token = store.getState().adminAuth.token;
  if (!token) {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/global/auth/refresh`,
        {
          withCredentials: true,
        },
      );

      if (res.data.data?.token) {
        const decoded: JWTAuthPayload = jwtDecode(res.data.data.token);
        console.log(decoded);
        if (decoded.type === "admin") {
          store.dispatch(setAdminCredentials({ token: res.data.data.token }));
          return null;
        } else {
          throw new Error("Admin trying to login with user credentials");
        }
      }

      console.log("On load refresh token succes but no token in response", res);
      return redirect("/admin/login"); // something wrong with the refresh api
    } catch (error) {
      console.log("error while cold start api fetch", error);

      return redirect("/admin/login"); // possibly no refresh token
    } finally {
      store.dispatch(setAppLoadingState(false));
    }
  }

  store.dispatch(setAppLoadingState(false));
  return null; // token alreay exists
};
