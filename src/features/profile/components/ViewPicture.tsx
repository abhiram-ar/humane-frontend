import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScanEye } from "lucide-react";

type Props = {
  src: string;
  title: string;
};
const ViewPicture: React.FC<Props> = ({ src, title }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button
            title="view photo"
            className="hover:bg-pop-green scale-105 cursor-pointer rounded-full bg-zinc-600/75 p-2 transition-all duration-200 ease-out hover:scale-120 hover:text-black"
          >
            <ScanEye />
          </button>
        </DialogTrigger>
        <DialogContent
          className="border-grey-dark-bg bg-[#272727]"
          aria-describedby="view profile photo"
          aria-description="view profile photo"
        >
          <DialogHeader>
            <DialogTitle className="text-almost-white">{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex aspect-square w-full items-center justify-center">
            <div className="h-full w-full overflow-clip rounded-md">
              <img src={src} className="h-full w-full object-cover" alt="profile-picture" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewPicture;
