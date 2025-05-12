import { ImageUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

const UploadProfilePic = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button
            title="update photo"
            className="hover:bg-pop-green scale-90 cursor-pointer rounded-full bg-zinc-600 p-2 transition-all duration-200 ease-out hover:scale-105 hover:text-black"
          >
            <ImageUp />
          </button>
        </DialogTrigger>
        <DialogContent
          className="border-grey-dark-bg bg-[#272727]"
          aria-describedby="view profile photo"
          aria-description="view profile photo"
        >
          <DialogHeader>
            <DialogTitle className="text-almost-white">Upload profile photo</DialogTitle>
            <DialogDescription className="text-zinc-500 text-sm">Photo should hava 1:1 aspect ratio</DialogDescription>
            {/* body */}
            <div>

            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadProfilePic;
