import ChangePassword, { ChangePasswordField } from "../components/ChangePassword";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const handleRecoverPassword = async (data: ChangePasswordField) => {
    try {
      await api.patch("/api/v1/user/auth/recover-password", {
        recoveryToken: "",
        newPassword: data.password,
      });
      toast.success("password changed", { position: "top-right" });
      navigate("/auth/login");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        // rethrow the error for calling form field errors
        throw error;
      } else {
        console.error("error while resetting password", error);
      }
    }
  };
  return (
    <div>
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
