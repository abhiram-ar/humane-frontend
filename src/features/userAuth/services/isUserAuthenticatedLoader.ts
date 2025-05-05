import { setCredentials } from "@/features/userAuth/redux/userAuthSlice";
import { redirect } from "react-router";
import axios from "axios";
import { store } from "@/app/store/store";
import { setAppLoadingState } from "@/app/store/appSlice";

export const isAuthenticatedLoader = async () => {
  const token = store.getState().userAuth.token;
  if (!token) {
    try {
      const res = await axios.get("http://localhost/api/v1/global/auth/refresh", {
        withCredentials: true,
      });
      if (res.data.data?.token) {
        store.dispatch(setCredentials({ token: res.data.data.token }));
        return redirect("/");
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
