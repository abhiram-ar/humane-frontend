import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import ImgCrop from "../base/Crop";
import { ImageUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { GetPresignedURLResponse } from "../../Types/GetPresingedURLResponse";
import axios from "axios";
import { useRef } from "react";
import useMutateUserAvatarPhoto from "../../hooks/useMutateUserAvatarPhoto";

const UploadProfilePic = () => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  const { mutate: mutateUserProfile } = useMutateUserAvatarPhoto();

  const handleUpload = async (file: File): Promise<void> => {
    // move the path logic to backend
    // and send back the path in presinged url response
    const key = `profile-pic/${file.name}`;

    const res = await api.post<GetPresignedURLResponse>("/api/v1/user/profile/upload/pre-signed", {
      fileName: key,
      mimeType: file.type,
    });

    // fresh instance of axios for puting
    await axios.put(res.data.data.preSignedURL, file, {
      headers: { "Content-Type": file.type },
    });

    mutateUserProfile(key);

    closeDialogRef.current?.click();

    //dont catch the error, the caling modal will need to handle is uploading state
  };

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
            <DialogDescription className="text-sm text-zinc-500">
              Photo should hava 1:1 aspect ratio
            </DialogDescription>
            {/* body */}
            <div>
              <ImgCrop handleUpload={handleUpload} />
            </div>
          </DialogHeader>
          <DialogClose ref={closeDialogRef} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadProfilePic;
