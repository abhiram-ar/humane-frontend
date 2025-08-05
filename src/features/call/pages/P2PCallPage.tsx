import { createPortal } from "react-dom";
import CallControls from "../components/CallControls";
import UserVideoPreview from "../components/UserVideoPreview";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { otherPartyJoined } from "../redux/callSlice";
import PeerVideoPreview from "../components/PeerVideoPreview";

const P2PVideoPage = () => {
  const dispath = useAppDispatch();
  const peerstaus = useAppSelector((state) => state.call.peerStatus);
  const toggleOtherPerson = () => {
    if (peerstaus == "pending") dispath(otherPartyJoined("joined"));
    else dispath(otherPartyJoined("pending"));
  };
  return createPortal(
    <>
      <div className="bg-grey-dark-bg absolute inset-0 overflow-clip">
        {/* draggable contaienr */}
        <div className="mx-auto mt-5 h-11/12 w-[95vw] border">
          {peerstaus === "joined" && <PeerVideoPreview />}
          <UserVideoPreview />
        </div>
          <button className="absolute bg-amber-200 top-0 left-0" onClick={() => toggleOtherPerson()}>Toggle peer</button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white">
          <CallControls />
        </div>
      </div>
    </>,
    document.getElementById("root")!,
  );
};

export default P2PVideoPage;
