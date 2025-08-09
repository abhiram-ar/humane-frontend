import { createPortal } from "react-dom";
import CallControls from "../components/CallControls";
import UserVideoPreview from "../components/UserVideoPreview";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { callStatus, ringing, callInitiated, callHangup } from "../redux/callSlice";
import PeerVideoPreview from "../components/PeerVideoPreview";
import { useState } from "react";
import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import toast from "react-hot-toast";
import { toastMessages } from "@/constants/ToastMessages";
import { useSearchParams } from "react-router";
import ErrorPage from "@/layout/PageNotFoundPage";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import Spinner from "@/components/Spinner";

const P2PVideoPage = () => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [searchParams] = useSearchParams();
  const { socket } = useChatSocketProvider();

  const dispath = useAppDispatch();
  const callStat = useAppSelector((state) => state.call.callStatus);
  const callId = useAppSelector((state) => state.call.callId);

  const peerId = searchParams.get("peer-id");
  const { httpStatus, isLoading } = usePublicUserProfileQuery(peerId ?? undefined);

  if (!peerId) return <ErrorPage message="No recipient" />;
  if (isLoading)
    return (
      <div className="bg-grey-dark-bg absolute inset-0 overflow-clip">
        <div className="flex h-full w-full flex-col items-center justify-center text-white">
          <Spinner />
          <p className="mt-1 text-zinc-400">Initializing</p>
        </div>
      </div>
    );
  if (httpStatus === 404) return <ErrorPage message="Invalid User" />;

  const toggleOtherPerson = () => {
    if (callStat == "pending") dispath(callStatus("joined"));
    else dispath(callStatus("pending"));
  };

  const hanedleStartCall = async () => {
    if (!socket) {
      console.log("fired");
      toast.error(toastMessages.CANNOT_START_CALL);
      return;
    }
    try {
      dispath(callInitiated());

      socket.emit("call.initiate", peerId, (res) => {
        if (res.ringing) {
          dispath(ringing({ callId: res.callId }));
        }
      });
    } catch (error) {
      console.log("error starting call", error);
      toast.error(toastMessages.SOMETHING_WENT_WRONG);
      dispath(callStatus("notInitiated"));
    }
  };

  const handleHandupCall = () => {
    if (!socket || !callId) {
      toast.error(toastMessages.CANNOT_START_CALL);
      return;
    }
    //2 states need to manges - while ringing  and while connected
    socket.emit("call.handup", { callId: callId });
    dispath(callHangup({ callId }));
  };

  return createPortal(
    <>
      <div className="bg-grey-dark-bg absolute inset-0 overflow-clip">
        {/* draggable contaienr */}
        <div className="mx-auto mt-5 h-11/12 w-[95vw] border">
          {callStat !== "notInitiated" && <PeerVideoPreview peerId={peerId} />}
          <UserVideoPreview />
        </div>
        <button className="absolute top-0 left-0 bg-amber-200" onClick={() => toggleOtherPerson()}>
          Toggle peer
        </button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white">
          <CallControls handupCall={handleHandupCall} startCall={hanedleStartCall} />
        </div>
      </div>
    </>,
    document.getElementById("root")!,
  );
};

export default P2PVideoPage;
