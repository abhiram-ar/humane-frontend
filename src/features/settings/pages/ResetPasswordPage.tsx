import { Link } from "react-router";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { ArrowLeft } from "lucide-react";
import ForgotPassword, {
  forgotPasswordFields,
} from "@/features/userAuth/components/ForgotPassword";
import { useIsMobile } from "@/hooks/useIsMobile";

const ResetPasswordPage = () => {
  const isMobile = useIsMobile();
  const handleForgotPassword = async (data: forgotPasswordFields) => {
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
    <>
      {isMobile && (
        <Link to="/settings" className="flex gap-1 ps-5 pt-5 text-white">
          <ArrowLeft />
          <p>Reset Password</p>
        </Link>
      )}

      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mt-10 w-2/3 max-w-[40rem]">
          <ForgotPassword handleForgotPassword={handleForgotPassword} />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
