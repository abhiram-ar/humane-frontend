import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import ButtonPop from "@/components/ButtonPop";
import ProfilePicSmall from "@/components/ProfilePicSmall";
import { Skeleton } from "@/components/ui/skeleton";
import { toastMessages } from "@/constants/ToastMessages";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { incomingCallAccepted, incomingCallRejected } from "../redux/callSlice";

const InCommingCallDialog = () => {
  const incommingCall = useAppSelector((state) => state.call.incomingCall);
  const { user } = usePublicUserProfileQuery(incommingCall?.callerId);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { socket } = useChatSocketProvider();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!incommingCall || !user || !socket) {
      setShowDialog(false);
      return;
    }

    if (Date.now() - new Date(incommingCall.at).getTime() < 1000 * 60) {
      setShowDialog(true);
      setTimeout(() => {
        socket.emit("call.action", { callId: incommingCall.callId, action: "timeout" });
        dispatch(incomingCallRejected({ callId: incommingCall.callId }));
        setShowDialog(false);
      }, 1000 * 60);
    }
  }, [incommingCall, user, socket]);

  const handleAccept = () => {
    if (!socket || !incommingCall) {
      toast.error(toastMessages.CANNOT_ACCEPT_CALL);
      return;
    }

    socket.emit("call.action", { action: "answered", callId: incommingCall.callId }, (res) => {
      console.log("callstatu", res);
      if (res.status === "callTakenOnOtherDevice") {
        toast(toastMessages.CALL_TAKEN_ON_OTHER_DEVICE);
        dispatch(incomingCallRejected({ callId: incommingCall.callId }));
        return;
      }
      if (res.status === "callEnded") {
        toast(toastMessages.CALL_ENDED);
        dispatch(incomingCallRejected({ callId: incommingCall.callId }));
        return;
      }

      if (res.status === "connected") {
        dispatch(incomingCallAccepted({ callId: incommingCall.callId }));
        toast.success("call connecected");
      }
    });
  };

  const handleDeclineCall = () => {
    if (!socket || !incommingCall) {
      toast.error(toastMessages.CANNOT_ACCEPT_CALL);
      return;
    }
    socket.emit("call.action", { action: "declined", callId: incommingCall.callId });
    dispatch(incomingCallRejected({ callId: incommingCall.callId }));
  };

  return (
    <div
      className={`bg-grey-light rounded-xl px-5 py-3 ring-2 transition-all delay-200 duration-200 ease-out ${showDialog ? "translate-y-5 scale-100 opacity-100" : "-translate-y-[10em] scale-90 opacity-20"}`}
    >
      <div className="flex items-center gap-3 text-white">
        <ProfilePicSmall className="border" avatarURL={user?.avatarURL} />

        <div>
          <p>Incoming Call</p>
          {user ? (
            <p>{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</p>
          ) : (
            <Skeleton className="w-full text-transparent">h</Skeleton>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <ButtonPop onClick={handleAccept}>Accept</ButtonPop>

        <button
          onClick={handleDeclineCall}
          className={`cursor-pointer rounded-full bg-red-400/80 px-4 py-1 font-semibold text-black hover:bg-red-400`}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default InCommingCallDialog;
