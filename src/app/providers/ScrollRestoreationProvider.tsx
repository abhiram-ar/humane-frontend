import React, { createContext, ReactNode, useContext, useRef } from "react";

type ScrollRestorationContextType = {
  map: Map<string, number>;
  ref: React.RefObject<HTMLDivElement | null>;
  setScroll(path: string): void;
};

const ScrollRestorationContext = createContext<ScrollRestorationContextType>({
  map: new Map(),
  ref: { current: null },
  setScroll: () => {
    console.error("no scroll context");
  },
});

export function ScrollRestorationProvider({ children }: { children: ReactNode }) {
  // Map: location.key -> scrollTop
  const positions = useRef(new Map());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const setScroll = (path: string) => {
    if (!scrollContainerRef.current) return;
    positions.current.set(path, scrollContainerRef.current.scrollTop);
  };

  return (
    <ScrollRestorationContext.Provider
      value={{ map: positions.current, ref: scrollContainerRef, setScroll }}
    >
      {children}
    </ScrollRestorationContext.Provider>
  );
}

export function useScrollContext() {
  return useContext(ScrollRestorationContext);
}

//  // 1. Get a reference to the scrollable div
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const location = useLocation();
//   const navigationType = useNavigationType(); // Helps distinguish PUSH (new page) from POP (back/forward)

//   useEffect(() => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.addEventListener("scroll", () =>
//         console.log(scrollContainerRef.current?.scrollTop),
//       );
//     }
//   }, [location.pathname]);

//   useEffect(() => {
//     const currentScrollContainer = scrollContainerRef.current;
//     if (!currentScrollContainer) {
//       // Defensive check: ensure the ref is attached
//       return;
//     }

//     // A. Logic for restoring scroll position when navigating TO a path
//     //    This effect runs AFTER the new route component has rendered within the Outlet.
//     //    We check the `navigationType` to differentiate between:
//     //    - 'POP': User clicked back/forward, so we should try to restore.
//     //    - 'PUSH'/'REPLACE': User navigated to a new page, so usually scroll to top.

//     if (navigationType === "POP") {
//       // If navigating back/forward, try to restore the saved position
//       const savedPosition = scrollPositions.get(location.pathname);
//       if (savedPosition !== undefined) {
//         currentScrollContainer.scrollTo(0, savedPosition);
//         console.log(`Restored scroll for ${location.pathname} to ${savedPosition}`);
//       }
//     } else {
//       // For 'PUSH' (new navigation) or 'REPLACE', scroll to the top
//       // This is the standard behavior for new pages.
//       currentScrollContainer.scrollTo(0, 0);
//       console.log(`Scrolled to top for new page: ${location.pathname}`);
//     }

//     // B. Logic for saving scroll position when navigating AWAY from a path
//     //    This part is slightly trickier due to useEffect's lifecycle.
//     //    We want to save the position of the *current* page *before* the
//     //    new page fully takes over and changes the scroll.

//     // A common robust pattern is to save the current position *before* this effect
//     // re-runs for the *new* location. We can achieve this using a cleanup function
//     // that captures the *previous* location's state.

//     // Capture the current scroll position for the current location *before*
//     // the next render cycle or component unmount.
//     // This value represents the scroll state of the page we are *about to leave*.
//     const cleanupLocationPath = location.pathname; // Capture for cleanup closure

//     // Return a cleanup function
//     return () => {
//       if (currentScrollContainer) {
//         const currentScrollTop = currentScrollContainer.scrollTop;
//         scrollPositions.set(cleanupLocationPath, currentScrollTop);
//         console.log(`Saved scroll for ${cleanupLocationPath}: ${currentScrollTop}`);
//       }
//     };
//   }, [location.pathname, navigationType]); // Re-run effect when path or navigation type changes
