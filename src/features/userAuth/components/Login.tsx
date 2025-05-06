import { z } from "zod";
import AuthBlock from "./AuthBlock";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerErrors } from "@/types/serverErrors";
import { AxiosError } from "axios";
import { Link } from "react-router";
import SignInWithGoogle from "./GoogleAuth";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
});
export type LoginUserFields = z.infer<typeof loginSchema>;

interface Props {
  handleLogin: (data: LoginUserFields) => Promise<void>;
  forgotPasswordPath?: string;
  showGoogleAuth?: boolean;
  showForgotPassword?: boolean;
}

const Login: React.FC<Props> = ({
  handleLogin,
  forgotPasswordPath = "/auth/forgot-password",
  showGoogleAuth = true,
  showForgotPassword = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const submitHandler: SubmitHandler<LoginUserFields> = async (data) => {
    try {
      await handleLogin(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        const serializedErrors = error.response.data.errors as ServerErrors;
        serializedErrors
          .filter((err) => err.field && Object.keys(data).includes(err.field))
          .map((err) =>
            setError(err.field as keyof typeof data, { message: err.message, type: "server" }),
          );
      } else console.log(error);
    }
  };

  return (
    <div className="w-[30rem]">
      <AuthBlock>
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
          {/* email */}
          <div>
            <label
              htmlFor="email"
              className="text-offwhite flex items-baseline gap-2 font-semibold"
            >
              email
              {errors.email && <p className="font-normal text-red-500">({errors.email.message})</p>}
            </label>

            <input
              type="text"
              {...register("email")}
              placeholder="eg: jhon@email.com"
              id="email"
              className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
            />
          </div>

          {/* password */}
          <div>
            <label
              htmlFor="password"
              className="text-offwhite flex items-baseline gap-2 font-semibold"
            >
              password
              {errors.password && (
                <p className="font-normal text-red-500">({errors.password.message})</p>
              )}
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="password"
              id="password"
              className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
            />
            {showForgotPassword && (
              <Link
                to={forgotPasswordPath}
                className="text-offwhite/50 hover:text-offwhite underline"
              >
                forgot Password?
              </Link>
            )}
          </div>

          <button
            type="submit"
            disabled={false}
            className={`rounded-base mt-3 w-full border-2 border-black px-3 py-2 font-medium ${
              !isSubmitting
                ? "bg-pop-green/90 hover:bg-pop-green active:bg-green-dark"
                : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
            }`}
          >
            Login
          </button>
        </form>
        {showGoogleAuth && (
          <>
            <div className="my-5 flex items-center justify-between">
              <hr className="w-2/5 border border-black text-black" />
              OR
              <hr className="w-2/5 border border-black text-black" />
            </div>
            <SignInWithGoogle />
          </>
        )}
      </AuthBlock>
    </div>
  );
};

export default Login;
