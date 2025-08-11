import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileNavbar from "../components/MobileNavbar";
import InCommingCallDialog from "@/features/call/components/InCommingCallDialog";

const HomeLayout = () => {
  const { ref } = useScrollContext();
  const isMobile = useIsMobile();
  return (
    <div className="bg-grey-dark-bg">
      <InCommingCallDialog />
      {!isMobile && <Sidebar />}
      <div
        ref={ref}
        className={`bg-grey-dark-bg h-screen min-h-screen overflow-y-auto ${!isMobile && "ms-60 lg:ml-90"}`}
      >
        <Outlet />
      </div>
      {isMobile && <MobileNavbar />}
    </div>
  );
};

export default HomeLayout;
