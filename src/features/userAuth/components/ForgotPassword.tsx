import { z } from "zod";
import AuthBlock from "./AuthBlock";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerErrors } from "@/types/serverErrors";
import { AxiosError } from "axios";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

export type forgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

type Props = {
  handleForgotPassword: (data: forgotPasswordFields) => Promise<void>;
};

const ForgotPassword: React.FC<Props> = ({ handleForgotPassword }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const submitHandler: SubmitHandler<forgotPasswordFields> = async (data) => {
    try {
      await handleForgotPassword(data);
      reset();
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
              Enter your email to recover
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

          <button
            type="submit"
            disabled={false}
            className={`rounded-base mt-3 w-full border-2 border-black px-3 py-2 font-medium ${
              !isSubmitting
                ? "bg-pop-green/90 hover:bg-pop-green active:bg-green-dark"
                : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
            }`}
          >
            Recover password
          </button>
        </form>
      </AuthBlock>
    </div>
  );
};

export default ForgotPassword;
