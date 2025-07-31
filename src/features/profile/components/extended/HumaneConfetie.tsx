import { ConfettiButton } from "@/components/confetie";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { coin } from "@/lib/coinConfettiPath";
import { useEffect, useRef } from "react";

export function HumaneConfetie() {
  const lastRewardedAt = useAppSelector((state) => state.profile.lastRewardedAt);
  const triggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!triggerRef.current || !lastRewardedAt) return;
    const timeRewarded = new Date(lastRewardedAt);

    //  adjusting for system delay, we dont want to fire these event when coponetn rerenders
    if (Date.now() - timeRewarded.getTime() < 3 * 1000) {
      triggerRef.current();
    }
  }, [lastRewardedAt]);

  return (
    <div className="">
      <ConfettiButton
        triggerRef={triggerRef}
        options={{
          get angle() {
            return 70;
          },
          colors: ["#FFE400", "#a4de21", "abf660"],
          shapes: [coin, "circle"],
          startVelocity: 80,
        }}
      ></ConfettiButton>
    </div>
  );
}
