import { z } from "zod";
import AuthBlock from "./AuthBlock";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import SignInWithGoogle from "./GoogleAuth";

const signUpSchema = z
  .object({
    firstName: z.string().trim().nonempty("cannot be empty").max(30, "max 30 characters"),
    lastName: z.string().trim().max(30, "max 30 characters"),
    email: z.string().trim().email("Invalid email"),
    password: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
    passwordConfirm: z.string().trim().nonempty("cannot be empty").min(8, "atlest 8 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "password does not match",
    path: ["passwordConfirm"],
  });

export type SignupUser = z.infer<typeof signUpSchema>;

interface Props {
  handleSignup: (data: SignupUser) => Promise<void>;
  showGoogleAuth?: boolean;
}

const Signup: React.FC<Props> = ({ handleSignup, showGoogleAuth = true }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const submitHandler: SubmitHandler<SignupUser> = async (data) => {
    try {
      await handleSignup(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const response = error.response.data;
        if (response.errors) {
          const typedErrors = response.errors as { message: string; field?: string }[];
          typedErrors
            .filter((err) => err.field && Object.keys(data).includes(err.field))
            .map((err) =>
              setError(err.field as keyof typeof data, { message: err.message, type: "server" }),
            );
        }
      } else console.log(error);
    }
  };

  return (
    <div className="w-[35rem]">
      <AuthBlock>
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
          {/* name */}
          <div className="flex justify-between gap-5">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="text-offwhite flex items-baseline gap-2 font-semibold"
              >
                first name
                {errors && errors.firstName && (
                  <p className="font-normal text-red-500">({errors.firstName.message})</p>
                )}
              </label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="eg: Jhon"
                id="firstName"
                className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
              />
            </div>

            {/* lastname */}
            <div className="w-full">
              <label
                htmlFor="lastName"
                className="text-offwhite flex items-baseline gap-2 font-semibold"
              >
                last name
                {errors && errors.lastName && (
                  <p className="font-normal text-red-500">({errors.lastName.message})</p>
                )}
              </label>

              <input
                type="text"
                {...register("lastName")}
                placeholder="eg: Doe"
                id="lastName"
                className="bg-green-subtle w-full rounded-sm border-2 border-black px-2 py-1.5"
              />
            </div>
          </div>

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
            disabled={isSubmitting}
            className={`rounded-base w-full border-2 border-black px-3 py-2 font-medium ${
              !isSubmitting
                ? "bg-pop-green/90 hover:bg-pop-green active:bg-green-dark cursor-pointer"
                : "bg-zinc-500 hover:bg-zinc-500 hover:text-black cursor-not-allowed"
            }`}
          >
            Sign up
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

export default Signup;
