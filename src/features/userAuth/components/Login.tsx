import { z } from "zod";
import AuthBlock from "./AuthBlock";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z
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

export type LoginUserFields = z.infer<typeof loginSchema>;

interface Props {
  redirect?: string;
}

const Login: React.FC<Props> = ({ redirect = "" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-[30rem]">
      <AuthBlock>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <button
            type="submit"
            disabled={false}
            className={`rounded-base mt-3 w-full border-2 border-black px-3 py-2 font-medium ${
              !false
                ? "bg-pop-green/90 hover:bg-pop-green active:bg-green-dark"
                : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
            }`}
          >
            Login
          </button>
        </form>

        <div className="my-5 flex items-center justify-between">
          <hr className="w-2/5 border border-black text-black" />
          OR
          <hr className="w-2/5 border border-black text-black" />
        </div>
      </AuthBlock>
    </div>
  );
};

export default Login;
