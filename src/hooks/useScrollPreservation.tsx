// src/components/ScrollManager.jsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

// src/utils/scrollPreservation.js
const scrollPositions: Record<string, number> = {};

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const saveScrollPosition = (key: string) => {
    scrollPositions[key] = window.scrollY;
  };

  const restoreScrollPosition = (key: string) => {
    window.scrollTo(0, scrollPositions[key] || 0);
  };

  useEffect(() => {
    // Save position before leaving
    const savePosition = () => {
      saveScrollPosition(location.key);
    };

    if (navigationType !== "POP") {
      // New navigation - scroll to top
      window.scrollTo(0, 0);
    }

    return () => {
      if (navigationType === "POP") return;
      savePosition();
    };
  }, [location.key, navigationType]);

  useEffect(() => {
    // Restore position when returning via back/forward
    if (navigationType === "POP") {
      restoreScrollPosition(location.key);
    }
  }, [location.key, navigationType]);

  return null;
}
