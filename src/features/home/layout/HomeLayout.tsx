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
      <div className="fixed top-0 right-5 border z-50">
        <InCommingCallDialog />
      </div>
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
