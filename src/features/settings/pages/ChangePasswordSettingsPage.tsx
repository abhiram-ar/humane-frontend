import { useIsMobile } from "@/hooks/useIsMobile";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import ChangePassword from "../components/ChangePassword";

const ChangePasswordSettingsPage = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <Link to="/settings" className="flex gap-1 ps-5 pt-5 text-white">
          <ArrowLeft />
          <p>Change Password</p>
        </Link>
      )}

      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mt-10 w-2/3 max-w-[40rem]">
          <ChangePassword />
        </div>
      </div>
    </>
  );
};

export default ChangePasswordSettingsPage;
