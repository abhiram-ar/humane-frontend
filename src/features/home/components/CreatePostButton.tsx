import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePostForm, { CreatePostFields } from "./CreatePostForm";
import { api } from "@/lib/axios";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useUserId from "@/features/profile/hooks/useUserId";

const CreatePostButton = () => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const queryClinet = useQueryClient();
  const userId = useUserId();

  const handleCreatePost = async (data: CreatePostFields) => {
    await api.post("/api/v1/post/", data);
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
    setTimeout(() => queryClinet.refetchQueries({ queryKey: ["timeline", userId] }), 2000);
    //dont catch the error it will be handled my calling component
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-pop-green/95 hover:bg-pop-green shadow-pop-green/20 hover:ring-pop-green/50 cursor-pointer rounded-4xl px-10 py-3 text-xl font-semibold text-black shadow-none transition-all duration-300 ease-out hover:scale-102 hover:ring-2">
            POST
          </button>
        </DialogTrigger>
        <DialogContent className="border-grey-dark-bg bg-[#272727]" aria-describedby="edit profile">
          <DialogHeader>
            <DialogTitle className="text-almost-white">Create a post</DialogTitle>
          </DialogHeader>
          <div>
            <CreatePostForm handleCreatePost={handleCreatePost} />
          </div>
          <DialogClose ref={closeDialogRef} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostButton;
