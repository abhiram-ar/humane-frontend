import { Link, useNavigate } from "react-router";
import Login, { LoginUserFields } from "../components/Login";
import {  api } from "@/lib/axios";
import { AxiosError } from "axios";
import { useAppDispatch } from "../hooks/store.hooks";
import { setCredentials } from "../redux/userAuthSlice";

const LoginPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const handleLogin = async (data: LoginUserFields) => {
    try {
      const res = await api.post("/api/v1/user/auth/login/email", data);

      const token = res.data.data.accessToken;
      console.log(token);
      dispath(setCredentials({ token }));

      // navigate
      navigate("/auth/signup");
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
      <h2 className="text-offwhite mb-5 text-center text-2xl font-semibold">
        Login to your human side
      </h2>
      <Login handleLogin={handleLogin} />
      <p className="text-offwhite pt-2 text-center">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="underline">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
