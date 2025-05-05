import { setCredentials } from "@/features/userAuth/redux/userAuthSlice";
import { store } from "./../app/store/store";
import { api } from "./axios";
import { redirect } from "react-router";

export const onStartLoader = async () => {
  const token = store.getState().userAuth.token;
  if (!token) {
    try {
      const res = await api.get("/api/v1/global/auth/refresh");
      if (res.data.data?.token) {
        store.dispatch(setCredentials({ token: res.data.data.token }));
        return null;
      } else {
        console.log("On load refresh token succes but no token in response");
        return redirect("/auth/login"); // something wrong with the refresh api
      }
    } catch (error) {
      console.log("error while cold start api fetch", error);

      return redirect("/auth/login"); // possibly no refresh token
    }
  }

  return null; // token alreay exists
};
