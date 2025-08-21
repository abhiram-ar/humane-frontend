import { setCredentials } from "@/features/userAuth/redux/userAuthSlice";
import { store } from "./../app/store/store";
import { redirect } from "react-router";
import axios from "axios";
import { setAppLoadingState } from "@/app/store/appSlice";
import { jwtDecode } from "jwt-decode";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";

export const onStartLoader = async () => {
  const token = store.getState().userAuth.token;
  if (!token) {
    try {
      const res = await axios.get("http://localhost/api/v1/global/auth/refresh", {
        withCredentials: true,
      });
      if (res.data.data?.token) {
        const decoded: JWTAuthPayload = jwtDecode(res.data.data.token);
        if (decoded.type === "user") {
          store.dispatch(setCredentials({ token: res.data.data.token, type: decoded.type }));
          return null;
        }
      }

      console.log("On load refresh token succes but no user token in response", res);
      return redirect("/auth/login"); // something wrong with the refresh api
    } catch (error) {
      console.log("error while cold start api fetch", error);

      return redirect("/auth/login"); // possibly no refresh token
    } finally {
      store.dispatch(setAppLoadingState(false));
    }
  }
  store.dispatch(setAppLoadingState(false));
  return null; // token alreay exists
};
