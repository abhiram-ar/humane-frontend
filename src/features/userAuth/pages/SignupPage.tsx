import { api } from "@/lib/axios";
import OTP from "../components/OTP";
import Signup, { SignupUser } from "../components/Singup";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ServerErrors } from "@/types/serverErrors";

const SignupPage = () => {
  const [user, setUser] = useState<SignupUser | null>(null);
  const [activationToken, setActivationToken] = useState<string | null>(null);
  const navigate = useNavigate();
  console.log(user, activationToken);

  const handleSignup = async (data: SignupUser) => {
    const res = await api.post("/api/v1/user/auth/signup", data);
    setUser(data);
    setActivationToken(res.data.data?.token);

    // dont catch the error from this funciton,
    // the errors will be catched by the calling funcition to show field errors
  };

  const handleOTPVerification = async (enteredOTP: string) => {
    try {
      await api.post("/api/v1/user/auth/verify", {
        activationCode: enteredOTP,
        activationToken,
      });

      toast.success("Account created", { position: "top-right" });
      navigate("/auth/login");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const serializedErrors = error.response.data.errors as ServerErrors;
        serializedErrors.forEach((err) => toast.error(err.message, { position: "bottom-right" }));
      } else {
        console.log(error);
      }
    }
  };

  const handleOTPResent = async () => {
    try {
      const res = await api.post("/api/v1/user/auth/signup", user);
      setActivationToken(res.data.data.token);
    } catch (error) {
      console.log("something went wrong while re-requesting verfication OTP", error);
    }
  };

  if (user?.email) {
    return (
      <OTP
        email={user.email}
        handleOTPResent={handleOTPResent}
        handleOTPVerification={handleOTPVerification}
      />
    );
  }

  return (
    <div>
      <h2 className="text-offwhite mb-5 text-center text-2xl font-semibold">
        Signup and share your humanity
      </h2>
      <Signup handleSignup={handleSignup} />

      <p className="text-offwhite pt-2 text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="underline">
          login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
