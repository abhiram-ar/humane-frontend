import { createPortal } from "react-dom";
import CallControls from "../components/CallControls";

const P2PVideoPage = () => {
  return createPortal(
    <>
      <div className="bg-grey-dark-bg absolute inset-0">
        <h2>Humane P2P call</h2>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white">
          <CallControls />
        </div>
      </div>
    </>,
    document.getElementById("root")!,
  );
};

export default P2PVideoPage;
