import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePostForm from "./CreatePostForm";
import { api } from "@/lib/axios";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useUserId from "@/hooks/useUserId";
import axios from "axios";
import { getPostMediaPresignedURL } from "../services/GetPostMediaPresingedURL";
import { CreatePostFields } from "../types/CreatePostFields";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Plus } from "lucide-react";
import { FullPost } from "@/features/profile/Types/GetUserTimelineResponse";
import { InfiniteTimelineData } from "@/features/profile/Types/InfiniteTimelinedata.type";
import { produce } from "immer";

export type CreatePostReponse = {
  data: { post: FullPost };
};

const CreatePostButton = () => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const queryClinet = useQueryClient();
  const userId = useUserId();
  const isMobile = useIsMobile();

  const handleCreatePost = async (data: CreatePostFields) => {
    const { poster, ...postData } = data;

    let attachmentKey: string | undefined;
    let attachmentType: string | undefined = undefined;

    if (poster && (poster as FileList)?.[0]) {
      const file = (poster as FileList)[0];
      attachmentType = file.type;

      const result = await getPostMediaPresignedURL(file);

      attachmentKey = result.key;
      await axios.put(result.preSignedURL, file);
    }

    const res = await api.post<CreatePostReponse>("/api/v1/post/", {
      ...postData,
      attachmentKey,
      attachmentType,
    });
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
    //dont catch the error it will be handled my calling component

    // read service wont give  hydrated  post data
    // setTimeout(() => queryClinet.refetchQueries({ queryKey: ["timeline", userId] }), 2000);

    queryClinet.setQueryData(["timeline", userId], (oldData: InfiniteTimelineData) => {
      if (!oldData) return oldData;

      const newState = produce(oldData, (draft) => {
        const firstPagePosts = draft.pages[0].posts ?? [];
        firstPagePosts.unshift(res.data.data.post);
        draft.pages[0].posts = firstPagePosts;
      });

      return newState;
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={`bg-pop-green/95 hover:bg-pop-green shadow-pop-green/20 hover:ring-pop-green/50 cursor-pointer rounded-4xl ${isMobile ? "h-fit p-3" : "px-10 py-3"} text-xl font-semibold text-black shadow-none transition-all duration-300 ease-out hover:scale-102 hover:ring-2`}
          >
            {isMobile ? <Plus /> : "POST"}
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
