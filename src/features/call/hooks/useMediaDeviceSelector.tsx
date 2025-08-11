import { useEffect, useState } from "react";

export function useMediaDeviceSelector(kind: MediaDeviceKind) {
  const [activeDeviceId, setActiveDeviceId] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "fetched" | "error">("idle");

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setTimeout>;

    const getDevices = async () => {
      try {
        setState("loading");
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const filtered = allDevices.filter((d) => d.kind === kind);
        setDevices(filtered);
        setState("fetched");
        return filtered;
      } catch (err) {
        console.error(err);
        setState("error");
        return [];
      }
    };

    const init = async () => {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const found = await getDevices();
      if (found.length > 0) {
        setActiveDeviceId(found[0].deviceId);
      }
    };

    setTimeout(init, 500);

    navigator.mediaDevices.ondevicechange = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(getDevices, 200);
    };

    return () => {
      setState("idle");
      navigator.mediaDevices.ondevicechange = null;
    };
  }, [kind]);

  return { activeDeviceId, setActiveDeviceId, devices, state };
}
