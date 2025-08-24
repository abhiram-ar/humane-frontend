import { DialogClose } from "@/components/ui/dialog";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import { ServerErrors } from "@/types/serverErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const editProfileSchema = z.object({
  HELPFUL_COMMENT: z.coerce.number().positive(),
  CHAT_CHECKIN: z.coerce.number().positive(),
});
export type RewardConfigForm = z.infer<typeof editProfileSchema>;

type GetRewardConfigResponse = {
  data: {
    HELPFUL_COMMENT: number;
    CHAT_CHECKIN: number;
  };
};

type Props = {
  handleEditProfile(data: RewardConfigForm): Promise<void>;
};

const EditRewardConfigForm: React.FC<Props> = ({ handleEditProfile }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RewardConfigForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: async () => {
      const res = await api.get<GetRewardConfigResponse>(`${API_ROUTES.REWARD_ROUTE}/config`);
      return res.data.data;
    },
  });

  const submitHandler: SubmitHandler<RewardConfigForm> = async (data) => {
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
      } else console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* name */}
      <div className="mb-5 w-full">
        <label
          htmlFor="firstName"
          className="text-almost-white ms-1.5 flex items-baseline gap-2 font-semibold"
        >
          Post comment reward amount
        </label>
        {errors && errors.HELPFUL_COMMENT && (
          <p className="ms-1.5 font-normal text-red-500">({errors.HELPFUL_COMMENT.message})</p>
        )}
        <input
          type="number"
          {...register("HELPFUL_COMMENT")}
          placeholder="40"
          id="firstName"
          className="w-full [appearance:textfield] rounded-md border border-zinc-500/50 bg-zinc-600 px-2 py-1.5 text-white outline-0 active:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      {/* lastname */}
      <div className="w-full">
        <label
          htmlFor="lastName"
          className="text-almost-white ms-1.5 flex items-baseline gap-2 font-semibold"
        >
          Chat replied on time reward amount
        </label>
        {errors && errors.CHAT_CHECKIN && (
          <p className="ms-1.5 font-normal text-red-500">({errors.CHAT_CHECKIN.message})</p>
        )}

        <input
          type="number"
          {...register("CHAT_CHECKIN")}
          placeholder="30"
          id="lastName"
          className="w-full [appearance:textfield] rounded-md border border-zinc-500/50 bg-zinc-600 px-2 py-1.5 text-white outline-0 active:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

export default EditRewardConfigForm;
