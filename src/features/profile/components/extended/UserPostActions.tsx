import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { api } from "@/lib/axios";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Link, Trash } from "lucide-react";
import toast from "react-hot-toast";
import useUserId from "../../hooks/useUserId";
import { ModerationStatus, PostVisibility } from "humane-common";
import { GetUserPostTimelineResponse } from "../../Types/GetUserTimelineResponse";

type DeletePostResponse = {
  message: "post deleted";
  data: {
    post: {
      id: string;
      createdAt: string;
      updatedAt: string;
      authorId: string;
      content: string;
      visibility: (typeof PostVisibility)[keyof typeof PostVisibility];
      posterKey: string | null;
      moderationStatus: (typeof ModerationStatus)[keyof typeof ModerationStatus];
      moderationMetadata: unknown | null;
    };
  };
};

const UserPostActions: React.FC<{ postId: string }> = ({ postId }) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText("post link not implemented yet");
      toast.success("link copied", {
        position: "top-center",
        style: { backgroundColor: "#464646", color: "white" },
      });
    } catch (error) {
      console.log("error while writing clipboard", error);
    }
  };

  type InfiniteTimelineData =
    | InfiniteData<GetUserPostTimelineResponse["data"], unknown>
    | undefined;

  const { mutate: deletePost } = useMutation({
    mutationKey: ["user-post", postId],
    mutationFn: async () => {
      const res = await api.delete<DeletePostResponse>(`/api/v1/post/${postId}`);
      return res.data.data;
    },
    onSuccess: (responseData) => {
      queryClient.setQueryData(["timeline", userId], (oldData: InfiniteTimelineData) => {
        if (!oldData) return oldData;
        //   return page.

        const newPagesArray = oldData.pages
          ? oldData.pages.map((page) => ({
              ...page,
              posts: page.posts
                .map((post) => post)
                .filter(
                  (post) => post.id !== responseData.post.id,
                ) as GetUserPostTimelineResponse["data"]["posts"],
            }))
          : oldData.pages;

        const update: InfiniteTimelineData = {
          pageParams: oldData.pageParams,
          pages: newPagesArray,
        };

        return update;
      });
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="hover:bg-grey-light text-offwhite cursor-pointer rounded-md p-1"
        >
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-grey-light border border-zinc-400/50 p-0 text-white"
        >
          <DropdownMenuItem className="cursor-pointer" onClick={() => deletePost()}>
            <Trash />
            Delete Post
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleCopyClipboard}>
            <Link />
            Copy Link
            {/* //TODO: copy post link to clipboard */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserPostActions;
