import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerErrors } from "@/types/serverErrors";
import { AxiosError } from "axios";
import AuthBlock from "@/features/userAuth/components/AuthBlock";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import toast from "react-hot-toast";
import { Link } from "react-router";

const changePasswordSchema = z
  .object({
    password: z.string().nonempty("cannot be empty"),
    newPassword: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
    newPasswordConfirm: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "password does not match",
    path: ["passwordConfirm"],
  });

export type ChangePasswordField = z.infer<typeof changePasswordSchema>;

const ChangePassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const submitHandler: SubmitHandler<ChangePasswordField> = async (data) => {
    try {
      await api.patch(`${API_ROUTES.USER_SERVICE}/profile/password`, {
        password: data.password,
        newPassword: data.newPassword,
      });
      reset();
      toast.success("Password changed succesfully");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        const serializedErrors = error.response.data.errors as ServerErrors;
        serializedErrors
          .filter((err) => err.field && Object.keys(data).includes(err.field))
          .map((err) =>
            setError(err.field as keyof typeof data, { message: err.message, type: "server" }),
          );
      } else {
        toast.error("Failed Changing password");
        console.log(error);
      }
    }
  };

  return (
    <div className="w-[30rem]">
      <AuthBlock>
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
          {/* password */}
          <div>
            <label
              htmlFor="oldpassword"
              className="text-offwhite flex items-baseline gap-2 font-semibold"
            >
              Old Password
            </label>
            {errors.password && (
              <p className="text-sm font-normal text-red-500">({errors.password.message})</p>
            )}
            <input
              type="password"
              {...register("password")}
              placeholder="Old Password"
              id="oldpassword"
              className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="text-offwhite flex items-baseline gap-2 font-semibold"
            >
              New password
              {errors.newPassword && (
                <p className="font-normal text-red-500">({errors.newPassword.message})</p>
              )}
            </label>
            <input
              type="newPassword"
              {...register("newPassword")}
              placeholder="new password"
              id="newPassword"
              className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
            />
          </div>

          {/* conform password */}
          <div>
            <label
              htmlFor="confirm new password"
              className="text-offwhite flex items-baseline gap-2 font-semibold"
            >
              confirm new password
              {errors.newPasswordConfirm && (
                <p className="font-normal text-red-500">({errors.newPasswordConfirm.message})</p>
              )}
            </label>
            <input
              type="password"
              {...register("newPasswordConfirm")}
              placeholder="confirm new password"
              id="newPassswordConfirm"
              className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
            />
          </div>

          <Link
            to="/settings/password/forgot-password"
            className="text-offwhite/50 hover:text-offwhite text-right underline"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            disabled={false}
            className={`rounded-base mt-3 w-full border-2 border-black px-3 py-2 font-medium ${
              !isSubmitting
                ? "bg-pop-green/90 hover:bg-pop-green active:bg-green-dark"
                : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
            }`}
          >
            Change Password
          </button>
        </form>
      </AuthBlock>
    </div>
  );
};

export default ChangePassword;
