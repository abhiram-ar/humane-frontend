import { ServerErrors } from "@/types/serverErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const editProfileSchema = z.object({
  firstName: z.string().trim().nonempty("required"),
  lastName: z.string().trim().optional(),
  bio: z.string().trim().max(256, "max 256").optional(),
});
export type EditFormFields = z.infer<typeof editProfileSchema>;

type Props = {
  nameAndBio: {
    firstName: string;
    lastName?: string;
    bio?: string;
  };
  handleEditProfile(data: EditFormFields): Promise<void>;
  CloseElem?: React.ComponentType<{ children: React.ReactNode }>;
};

const EditProfileForm: React.FC<Props> = ({ nameAndBio, handleEditProfile, CloseElem }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditFormFields>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: nameAndBio.firstName,
      lastName: nameAndBio.lastName,
      bio: nameAndBio.bio,
    },
  });

  const submitHandler: SubmitHandler<EditFormFields> = async (data) => {
    try {
      await handleEditProfile(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        const serializedErrors = error.response.data.errors as ServerErrors;
        serializedErrors
          .filter((err) => err.field && Object.keys(data).includes(err.field))
          .map((err) =>
            setError(err.field as keyof typeof data, { message: err.message, type: "server" }),
          );
      } else {
        console.log(error);
        toast.error("Error updating progile", { position: "top-right" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
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
          rows={10}
          {...register("bio")}
          placeholder="eg: Doe"
          id="bio"
          className="w-full resize-none rounded-md border border-zinc-500/50 bg-zinc-600 px-2 py-1.5 text-white outline-0 active:ring-0"
        />
      </div>

      <div
        className={`${CloseElem ? "grid grid-cols-2 gap-5" : "justify-centers flex items-center"}`}
      >
        {CloseElem && (
          <CloseElem>
            <div
              className={`rounded-base mt-5 w-full rounded-3xl border border-black px-3 py-2 font-medium ${
                !isSubmitting
                  ? "active:bg-grey-light bg-white/90 hover:bg-white"
                  : "bg-zinc-500 hover:bg-zinc-500 hover:text-black"
              }`}
            >
              cancel
            </div>
          </CloseElem>
        )}

        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className={`rounded-base mt-5 w-full rounded-3xl border border-black px-3 py-2 font-medium ${
            isDirty || isSubmitting
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
