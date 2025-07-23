import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScanEye } from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
  src: string;
  title: string;
  children?: ReactNode; // child should be a have a button element
};
const ViewPicture: React.FC<Props> = ({ src, title, children }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <button
              title="view photo"
              className="hover:bg-pop-green scale-105 cursor-pointer rounded-full bg-zinc-600/75 p-2 transition-all duration-200 ease-out hover:scale-120 hover:text-black"
            >
              <ScanEye />
            </button>
          )}
        </DialogTrigger>
        <DialogContent
          className="border-grey-dark-bg !max-h-200 !max-w-3xl w-fit bg-[#272727]/50 backdrop-blur-md"
          aria-describedby="view profile photo"
          aria-description="view profile photo"
        >
          <DialogHeader>
            <DialogTitle className="text-almost-white">{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex aspect-auto h-full w-full items-center justify-center">
            <div className="max-h-150 h-full w-fit overflow-clip rounded-md">
              <img src={src} className="h-full  w-full object-contain" alt="profile-picture" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewPicture;
