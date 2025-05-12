import { ImageMinus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RemoveProfilePicture = () => {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <div className="hover:bg-pop-green scale-90 cursor-pointer rounded-full bg-zinc-600 p-2 transition-all duration-200 ease-out hover:scale-105 hover:text-black">
            <ImageMinus />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to Remove profile picture?</AlertDialogTitle>
            <AlertDialogDescription>You cannot undo this action.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-blood rounded-2xl ease-out hover:bg-red-800 cursor-pointer">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RemoveProfilePicture;
