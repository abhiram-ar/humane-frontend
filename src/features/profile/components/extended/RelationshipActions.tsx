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
import ButtonPop from "@/components/ButtonPop";
import ButtonNeutal from "@/components/ButtonNeutal";
import ButtonLowPriority from "@/components/ButtonLowPriority";
import { Link } from "react-router";

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
        <ButtonPop onClick={() => sendFriendRequest(userId)}>Add Friend </ButtonPop>
      )}

      {data?.status === "friendReqWaitingApproval" && (
        <div className="flex gap-2">
          <ButtonPop onClick={() => acceptFriendReq(userId)}>Accept Request</ButtonPop>
          <ButtonNeutal onClick={() => removeFriendship(userId)} title="cancel">
            Decline
          </ButtonNeutal>
        </div>
      )}

      {data?.status === "friendreqSend" && (
        <ButtonNeutal onClick={() => cancelFriendReq(userId)} title="cancel">
          cancel Request
        </ButtonNeutal>
      )}

      {data?.status === "friends" && (
        <div className="flex gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ButtonLowPriority>Remove Friend</ButtonLowPriority>
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

          <div>
            <Link to={`/chat/user/${userId}`}>
              <ButtonNeutal>Message</ButtonNeutal>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipActions;
