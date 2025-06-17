import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { Ellipsis } from "lucide-react";
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
import useDeleteCommentMutation from "../hooks/useDeleteCommentMutation";

const UserCommentActions: React.FC<{ commentId: string; postId: string }> = ({
  commentId,
  postId,
}) => {
  const { mutate: deleteComment } = useDeleteCommentMutation(commentId, postId);

  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

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
            Delete Comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* rendering dialog modal inside dropdown is not possible, since when dropdown menu unmount, alert is forced to unmount */}
      <>
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this comment ?</AlertDialogTitle>
              <AlertDialogDescription>You cannot undo this action.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteComment({ commentId, postId })}
                className="bg-red-blood cursor-pointer rounded-2xl ease-out hover:bg-red-800"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </div>
  );
};

export default UserCommentActions;
