import ChangePassword, { ChangePasswordField } from "../components/ChangePassword";
import { api } from "@/lib/axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { toastMessages } from "@/constants/ToastMessages";

const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const recoveryToken = searchParams.get("recoveryToken");

  const handleRecoverPassword = async (data: ChangePasswordField) => {
    if (!recoveryToken) {
      console.log("No token to reset password");
      toast.error("Invalid request", { position: "bottom-right" });
      return;
    }

    try {
      const res = await api.patch(`${API_ROUTES.USER_SERVICE}/auth/reset-password`, {
        recoveryToken,
        newPassword: data.password,
      });
      console.log(res);
      toast.success("password changed", { position: "top-right" });
      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.error(toastMessages.SOMETHING_WENT_WRONG);
      console.log(error);
      if (error instanceof AxiosError && error.response?.data) {
        // rethrow the error for calling form field errors
        throw error;
      } else {
        console.error("error while resetting password", error);
      }
    }
  };
  return (
    <div className="flex h-130 flex-col items-center justify-center">
      <ChangePassword handlePasswordChange={handleRecoverPassword} />
      <p className="pt-2 text-center">
        <Link to="/auth/login" className="text-offwhite/50 hover:text-offwhite underline">
          Go back to login page.
        </Link>
      </p>
    </div>
  );
};

export default RecoverPasswordPage;
