// ScrollPositionContext.jsx
import { createContext, ReactNode, useContext, useRef } from "react";

type ScrollPositionContextType = {
  setPosition: (key: string, value: number) => void;
  getPosition: (key: string) => number;
};

const ScrollPositionContext = createContext<ScrollPositionContextType>({
  setPosition: () => {},
  getPosition: () => 0,
});

export function ScrollPositionProvider({ children }: { children: ReactNode }) {
  // Use a ref to avoid unnecessary re-renders
  const positions = useRef<Record<string, number>>({});

  const setPosition = (key: string, value: number) => {
    positions.current[key] = value;
  };

  const getPosition = (key: string) => positions.current[key] || 0;

  return (
    <ScrollPositionContext.Provider value={{ setPosition, getPosition }}>
      {children}
    </ScrollPositionContext.Provider>
  );
}

export function useScrollPosition() {
  return useContext(ScrollPositionContext);
}
