import { createContext } from "react";

import type { OfflinePeriod } from "../utils/interfaces";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OnlineStatusContextValue {
  isOnline: boolean;
  lastChecked: Date | null;
  offlinePeriods: OfflinePeriod[];
  totalOfflineMs: number;
  resetTracking: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const OnlineStatusContext = createContext<OnlineStatusContextValue | null>(
  null,
);
