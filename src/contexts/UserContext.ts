import { createContext } from "react";
import type { User } from "../models/user";

export interface UserContextValue {
  user: User;
  openPeriodIfNeeded: (startTs: number) => void;
  closeAnyOpenPeriod: (endTs: number) => void;
  resetPeriods: () => void;
  saveUser: () => void;
  reloadUser: () => User;
  syncWithStorage: (online: boolean, now: number) => User;
}

export const UserContext = createContext<UserContextValue | null>(null);
