import { useScrollContext } from "@/app/providers/ScrollRestoreationProvider";
import { useEffect } from "react";
import { useLocation } from "react-router";

const useRestoreScrollPosition = () => {
  const { ref, map } = useScrollContext();
  const location = useLocation();

  useEffect(() => {
    if (!ref.current) return;
    if (map.has(location.pathname)) ref.current.scrollTo({ top: map.get(location.pathname) });
  }, [location.pathname, map, ref]);
  return;
};

export default useRestoreScrollPosition;
