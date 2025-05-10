import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "./EditProfileForm";

const EditProfileButton = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="rounded-2xl border border-black bg-zinc-500 px-5 py-1 font-semibold text-black transition-all duration-100 ease-out hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700">
            Edit profile
          </button>
        </DialogTrigger>
        <DialogContent className="border-grey-dark-bg bg-[#272727]">
          <DialogHeader>
            <DialogTitle className="text-almost-white">Edit profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileButton;
