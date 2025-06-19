import { Link } from "react-router";
import ForgotPassword, { forgotPasswordFields } from "../components/ForgotPassword";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { API_ROUTES } from "@/lib/API_ROUTES";

const ForgotPasswordPage = () => {
  const handleForgotPassword = async (data: forgotPasswordFields) => {
    console.log(data);
    try {
      const res = await api.post(`${API_ROUTES.USER_SERVICE}/auth/forgot-password`, data);
      toast.success(res.data.message, { position: "top-right" });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        // rethrowing error for calling form field error
        throw error;
      } else {
        console.error("error while requesting for password reset", error);
      }
    }
  };

  return (
    <div>
      <ForgotPassword handleForgotPassword={handleForgotPassword} />
      <p className="pt-2 text-center">
        <Link to="/auth/login" className="text-offwhite/50 hover:text-offwhite underline">
          Go back to login page.
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
