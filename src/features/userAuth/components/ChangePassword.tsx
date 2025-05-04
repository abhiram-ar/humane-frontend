import { z } from "zod";
import AuthBlock from "./AuthBlock";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerErrors } from "@/types/serverErrors";
import { AxiosError } from "axios";

const changePasswordSchema = z
  .object({
    password: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
    passwordConfirm: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "password does not match",
    path: ["passwordConfirm"],
  });

export type ChangePasswordField = z.infer<typeof changePasswordSchema>;

interface Props {
  handlePasswordChange: (data: ChangePasswordField) => Promise<void>;
}

const ChangePassword: React.FC<Props> = ({ handlePasswordChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const submitHandler: SubmitHandler<ChangePasswordField> = async (data) => {
    try {
      await handlePasswordChange(data);
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
          </div>

          {/* conform password */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="text-offwhite flex items-baseline gap-2 font-semibold"
            >
              confirm password
              {errors.passwordConfirm && (
                <p className="font-normal text-red-500">({errors.passwordConfirm.message})</p>
              )}
            </label>
            <input
              type="password"
              {...register("passwordConfirm")}
              placeholder="confirm password"
              id="passwordConfirm"
              className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
            />
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
      </AuthBlock>
    </div>
  );
};

export default ChangePassword;
