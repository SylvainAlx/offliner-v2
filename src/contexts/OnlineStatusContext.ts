import { createContext } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OnlineStatusContextValue {
  isOnline: boolean;
  lastChecked: Date | null;
  totalOfflineMs: number;
  resetTracking: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const OnlineStatusContext = createContext<OnlineStatusContextValue | null>(
  null,
);
