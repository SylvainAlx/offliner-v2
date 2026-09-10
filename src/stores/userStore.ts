import { create } from "zustand";
import { User } from "../models/user";

export interface UserStore {
  user: User;
  updateName: (name: string) => void;
  openPeriodIfNeeded: (startTs: number) => void;
  closeAnyOpenPeriod: (endTs: number) => void;
  resetPeriods: () => void;
  saveUser: () => void;
  reloadUser: () => User;
  syncWithStorage: (online: boolean, now: number) => User;
}

function createInitialUser(): User {
  const user = new User();
  user.loadUser();

  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  const now = Date.now();
  if (isOnline) {
    user.periodList.closeAnyOpenPeriod(now);
  } else {
    user.periodList.openPeriodIfNeeded(now);
  }
  user.saveUser();
  return user;
}

export const useUser = create<UserStore>((set, get) => ({
  user: createInitialUser(),

  updateName: (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const next = get().user.clone();
    next.name = trimmedName;
    next.saveUser();
    set({ user: next });
  },

  saveUser: () => {
    get().user.saveUser();
  },

  openPeriodIfNeeded: (startTs) => {
    const next = get().user.clone();
    next.periodList.openPeriodIfNeeded(startTs);
    next.saveUser();
    set({ user: next });
  },

  closeAnyOpenPeriod: (endTs) => {
    const next = get().user.clone();
    const duration = next.periodList.closeAnyOpenPeriod(endTs);
    if (duration !== undefined) {
      next.addOfflinium(duration);
    }
    next.saveUser();
    set({ user: next });
  },

  resetPeriods: () => {
    const next = get().user.clone();
    next.periodList.clearPeriods();
    next.offlinium = 0;
    next.saveUser();
    set({ user: next });
  },

  reloadUser: () => {
    const user = new User();
    user.loadUser();
    set({ user });
    return user;
  },

  syncWithStorage: (online, now) => {
    const user = new User();
    user.loadUser();
    if (online) {
      user.periodList.closeAnyOpenPeriod(now);
    } else {
      user.periodList.openPeriodIfNeeded(now);
    }
    user.saveUser();
    set({ user });
    return user;
  },
}));
