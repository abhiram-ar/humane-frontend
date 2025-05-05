import HumaeLoader from "@/components/HumaeLoader";
import { Outlet } from "react-router";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";

const FadeTransitionLayout = () => {
  const appLoading = useAppSelector((state) => state.globalApp.appLoading);

  return (
    <div className="bg-grey-dark-bg relative h-screen w-screen overflow-hidden">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
          appLoading ? "z-50 scale-100 opacity-100" : "pointer-events-none z-0 scale-95 opacity-0"
        }`}
      >
        <HumaeLoader />
      </div>

      <div
        className={`transition-all duration-700 ease-out ${appLoading ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default FadeTransitionLayout;
