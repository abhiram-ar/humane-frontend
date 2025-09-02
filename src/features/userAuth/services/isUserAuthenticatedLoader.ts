import { setCredentials } from "@/features/userAuth/redux/userAuthSlice";
import { redirect } from "react-router";
import axios from "axios";
import { store } from "@/app/store/store";
import { setAppLoadingState } from "@/app/store/appSlice";
import { jwtDecode } from "jwt-decode";
import { JWTAuthPayload } from "../../../types/JWTAuthPayload";

export const isAuthenticatedLoader = async () => {
  const token = store.getState().userAuth.token;
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
        if (decoded.type === "user") {
          store.dispatch(setCredentials({ token: res.data.data.token, type: decoded.type }));
          return redirect("/");
        } else {
          throw new Error("User trying to login with admin credentials");
        }
      }

      console.log("On load refresh token succes but no token in response", res);
      return null; // something wrong with the refresh api
    } catch (error) {
      console.log("error while cold start api fetch", error);

      return null; // possibly no refresh token
    } finally {
      store.dispatch(setAppLoadingState(false));
    }
  }

  store.dispatch(setAppLoadingState(false));
  return redirect("/"); // token alreay exists
};
