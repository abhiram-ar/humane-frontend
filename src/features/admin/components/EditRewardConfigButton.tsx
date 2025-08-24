import { RewardConfigForm } from "./EditRewardsConfigForm";
import React, { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditRewardConfigForm from "./EditRewardsConfigForm";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import toast from "react-hot-toast";

const EditRewardConfigButton: React.FC = () => {
  const closeDialogRef = useRef<HTMLButtonElement>(null);

  const handleUpdateRewardConfig = async (data: RewardConfigForm): Promise<void> => {
    await api.put(`${API_ROUTES.REWARD_ROUTE}/config`, data);
    toast.success("Reward config updated", { position: "top-right" });
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 font-semibold text-black transition-all duration-100 ease-out hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700">
            Config Reward
          </button>
        </DialogTrigger>
        <DialogContent className="border-grey-dark-bg bg-[#272727]" aria-describedby="edit profile">
          <DialogHeader>
            <DialogTitle className="text-almost-white">Edit profile</DialogTitle>
          </DialogHeader>
          <EditRewardConfigForm handleEditProfile={handleUpdateRewardConfig} />
          <DialogClose ref={closeDialogRef} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditRewardConfigButton;
