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
import { Skeleton } from "@/components/ui/skeleton";
import useRelationshipStausQuery from "../../hooks/useRelationshipStausQuery";
import useSendFriendReqMutation from "../../hooks/useSendFriendReqMutation";
import useCancelFriendReqMutation from "../../hooks/useCancelFriendReqMutation";
import useAcceptFriendReqMutation from "../../hooks/useAcceptFriendReqMutation";
import useRemoveFriendshipMutation from "../../hooks/useRemoveFriendshipMutation";

type Props = {
  userId: string;
};

const RelationshipActions: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useRelationshipStausQuery(userId);

  const { mutate: sendFriendRequest } = useSendFriendReqMutation();

  const { mutate: cancelFriendReq } = useCancelFriendReqMutation();

  const { mutate: acceptFriendReq } = useAcceptFriendReqMutation();

  const { mutate: removeFriendship } = useRemoveFriendshipMutation();

  if (isLoading)
    return (
      <Skeleton className="w-30 rounded-full">
        <button className="px-4 py-1">.</button>
      </Skeleton>
    );

  return (
    <div>
      {data?.status === "strangers" && (
        <button
          className="bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full px-4 py-1 font-semibold text-black"
          onClick={() => sendFriendRequest(userId)}
        >
          Add Friend{" "}
        </button>
      )}

      {data?.status === "friendReqWaitingApproval" && (
        <div className="flex gap-2">
          <button
            className="bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full px-4 py-1 font-semibold text-black"
            onClick={() => acceptFriendReq(userId)}
          >
            Accept{" "}
          </button>
          <button
            className="bg-offwhite cursor-pointer rounded-full px-4 py-1 font-semibold text-black hover:bg-white"
            onClick={() => removeFriendship(userId)}
            title="cancel"
          >
            Decline
          </button>
        </div>
      )}

      {data?.status === "friendreqSend" && (
        <button
          className="bg-offwhite cursor-pointer rounded-full px-4 py-1 font-semibold text-black hover:bg-white"
          onClick={() => cancelFriendReq(userId)}
          title="cancel"
        >
          cancel Request
        </button>
      )}

      {data?.status === "friends" && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="cursor-pointer rounded-full bg-zinc-400/90 px-4 py-1 font-semibold text-black hover:bg-zinc-400">
                Remove Friend
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to remove this friend?</AlertDialogTitle>
                <AlertDialogDescription>You cannot undo this action.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeFriendship(userId)}
                  className="bg-red-blood cursor-pointer rounded-2xl ease-out hover:bg-red-800"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default RelationshipActions;
