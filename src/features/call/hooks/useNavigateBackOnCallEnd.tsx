import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const useNavigateBackOnCallEnd = () => {
  const callStat = useAppSelector((state) => state.call.callStatus);
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    if (!state?.from) return;
    let timer: ReturnType<typeof setTimeout>;
    if (callStat === "ended") {
      timer = setTimeout(() => navigate(state.from, { replace: true }), 3 * 1000);
    }

    return () => clearTimeout(timer);
  }, [callStat, state?.from]);
  return;
};

export default useNavigateBackOnCallEnd;
