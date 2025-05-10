import { DialogClose } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const editProfileSchema = z.object({
  firstName: z.string().nonempty("required"),
  lastName: z.string().optional(),
  bio: z.string().max(80, "max 80").optional(),
});
type EditFormFields = z.infer<typeof editProfileSchema>;

const EditProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormFields>({
    resolver: zodResolver(editProfileSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      {/* name */}
      <div className="flex justify-between gap-5">
        <div className="w-full">
          <label
            htmlFor="firstName"
            className="text-almost-white ms-1.5 flex items-baseline gap-2 font-semibold"
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
            className="w-full rounded-md border border-zinc-500/50 bg-zinc-600 px-2 py-1.5 text-white outline-0 active:ring-0"
          />
        </div>

        {/* lastname */}
        <div className="w-full">
          <label
            htmlFor="lastName"
            className="text-almost-white ms-1.5 flex items-baseline gap-2 font-semibold"
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
            className="w-full rounded-md border border-zinc-500/50 bg-zinc-600 px-2 py-1.5 text-white outline-0 active:ring-0"
          />
        </div>
      </div>
      {/* bio */}
      <div className="mt-3 w-full">
        <label
          htmlFor="bio"
          className="text-almost-white ms-1.5 flex items-baseline gap-2 font-semibold"
        >
          bio
          {errors && errors.bio && (
            <p className="font-normal text-red-500">({errors.bio.message})</p>
          )}
        </label>

        <textarea
          rows={3}
          {...register("bio")}
          placeholder="eg: Doe"
          id="bio"
          className="w-full resize-none rounded-md border border-zinc-500/50 bg-zinc-600 px-2 py-1.5 text-white outline-0 active:ring-0"
        />
      </div>

      <div className="flex gap-5">
        <DialogClose
          className={`rounded-base mt-5 w-full rounded-3xl border border-black px-3 py-2 font-medium ${
            !isSubmitting
              ? "active:bg-grey-light bg-white/90 hover:bg-white"
              : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
          }`}
        >
          cancel
        </DialogClose>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded-base mt-5 w-full rounded-3xl border border-black px-3 py-2 font-medium ${
            !isSubmitting
              ? "bg-pop-green/90 hover:bg-pop-green active:bg-green-dark"
              : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
          }`}
        >
          update
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
