import { ChevronDown } from "lucide-react";

type Props = {
  targetElemRef: React.RefObject<HTMLDivElement | null>;
};
const ScrollToView: React.FC<Props> = ({ targetElemRef: containerRef }) => {
  const handleScrollToBottom = () => {
    console.log("clicked", containerRef);
    if (!containerRef.current) return;
    containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      onClick={handleScrollToBottom}
      title="scroll to bottom"
      className="bg-pop-green flex h-fit w-fit items-center justify-center rounded-full p-2 text-black ring ring-green-dark z-1000 "
    >
      <ChevronDown className="" />
    </div>
  );
};

export default ScrollToView;
