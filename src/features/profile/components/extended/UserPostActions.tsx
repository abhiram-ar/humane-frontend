import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { Ellipsis, Link } from "lucide-react";
import toast from "react-hot-toast";
import useDeleteUserPost from "../../hooks/useDeleteUserPost";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { useState } from "react";

const UserPostActions: React.FC<{ postId: string }> = ({ postId }) => {
  const { mutate: deletePost } = useDeleteUserPost(postId);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${import.meta.env.VITE_FRONTEND_BASE_URL}/post/${postId}`,
      );
      toast.success("link copied", {
        position: "top-center",
        style: { backgroundColor: "#464646", color: "white" },
      });
    } catch (error) {
      console.log("error while writing clipboard", error);
    }
  };

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
          <DropdownMenuItem className="cursor-pointer" onClick={() => setDeleteAlertOpen(true)}>
            <Trash size={20} />
            Delete Post
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleCopyClipboard}>
            <Link />
            Copy Link
            {/* //TODO: copy post link to clipboard */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* rendering dialog modal inside dropdown is not possible, since when dropdown menu unmount, alert is forced to unmount */}
      <>
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
              <AlertDialogDescription>You cannot undo this action.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePost()}
                className="bg-red-blood cursor-pointer rounded-2xl ease-out hover:bg-red-800"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </div>
  );
};

export default UserPostActions;
