import { Outlet, useLocation } from "react-router";
import SettingsNavigator from "../components/SettingsNavigator";
import { useIsMobile } from "@/hooks/useIsMobile";

const SettingsLayout = () => {
  const isMobie = useIsMobile();
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <div>
      {!isMobie ? (
        <>
          <div>
            <SettingsNavigator />
          </div>
          <div className="ms-72">
            <Outlet />
          </div>
        </>
      ) : (
        <>
          <div>
            {["/settings", "/settings/"].includes(pathname) ? <SettingsNavigator /> : <Outlet />}
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsLayout;
