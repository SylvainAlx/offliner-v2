import type { ReactNode } from "react";

import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { OnlineStatusContext } from "./OnlineStatusContext";

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface OnlineStatusProviderProps {
  children: ReactNode;
}

export function OnlineStatusProvider({ children }: OnlineStatusProviderProps) {
  const value = useOnlineStatus();

  return (
    <OnlineStatusContext.Provider value={value}>
      {children}
    </OnlineStatusContext.Provider>
  );
}
