import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAppDispatch } from "../hooks/store.hooks";
import { useNavigate } from "react-router";
import { setCredentials } from "../redux/userAuthSlice";
import { AxiosError } from "axios";
import { ServerErrors } from "@/types/serverErrors";
import { jwtDecode } from "jwt-decode";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";

const SignInWithGoogle: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await api.post("/api/v1/user/auth/login/google", {
        credentials: credentialResponse.credential,
      });

      if (res.data.data?.accessToken) {
        const decoded: JWTAuthPayload = jwtDecode(res.data.data.token);
        if (decoded.type === "user") {
          dispatch(setCredentials({ token: res.data.data.token, type: decoded.type }));
          return navigate("/", { replace: true });
        } else {
          throw new Error("User trying to login with admin credentials");
        }
      }

      throw new Error("no accessToken in server response");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        console.log(error);
        const serverErrors = error.response.data.errors as ServerErrors;
        serverErrors.forEach((err) => toast.error(err.message, { position: "top-right" }));
        return;
      }
      toast.error("Something went wrong");
      console.log("error while verifying OAuth with Backend", error);
    }
  };

  return (
    <>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onScriptLoadSuccess={() => setLoading(false)}
      >
        {!loading ? (
          <div className="flex items-center justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_black" width={"320px"} />
          </div>
        ) : (
          <div className="rounded-base mx-auto flex w-fit items-center justify-center gap-3 border border-black bg-[#d9d9d9] px-3 py-2 hover:bg-[#bababa] active:bg-zinc-400">
            {/* <GoogleIcon /> */}

            <button className="font-medium">SignIn with Google</button>
          </div>
        )}
      </GoogleOAuthProvider>
    </>
  );
};

export default SignInWithGoogle;
