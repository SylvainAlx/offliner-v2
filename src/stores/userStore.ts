import { create } from "zustand";
import { User } from "../models/user";
import {
  COMPANION_INVOCATION_COST,
} from "../utils/constants";

export interface UserStore {
  user: User;
  updateName: (name: string) => void;
  openPeriodIfNeeded: (startTs: number) => void;
  closeAnyOpenPeriod: (endTs: number) => void;
  resetPeriods: () => void;
  saveUser: () => void;
  invokeCompanion: (offlineMs: number) => boolean;
  releaseCompanionAndGetOfflinium: (companionId: string) => boolean;
  completeCompanionInvocations: (offlineMs: number) => void;
  reloadUser: () => User;
  syncWithStorage: (online: boolean, now: number) => User;
}

function createInitialUser(): User {
  const user = new User();
  user.loadUser();

  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  const now = Date.now();
  if (isOnline) {
    user.closeOfflinePeriod(now);
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

  invokeCompanion: (offlineMs) => {
    const next = get().user.clone();
    if (!next.spendOfflinium(COMPANION_INVOCATION_COST, offlineMs)) {
      return false;
    }
    next.village.addPendingCompanion(offlineMs);
    next.saveUser();
    set({ user: next });
    return true;
  },

  releaseCompanionAndGetOfflinium: (companionId) => {
    const next = get().user.clone();
    if (!next.releaseCompanionAndGetOfflinium(companionId)) return false;

    next.saveUser();
    set({ user: next });
    return true;
  },

  completeCompanionInvocations: (offlineMs) => {
    const next = get().user.clone();
    if (next.village.completePendingCompanions(offlineMs) === 0) return;

    next.saveUser();
    set({ user: next });
  },

  openPeriodIfNeeded: (startTs) => {
    const next = get().user.clone();
    next.periodList.openPeriodIfNeeded(startTs);
    next.saveUser();
    set({ user: next });
  },

  closeAnyOpenPeriod: (endTs) => {
    const next = get().user.clone();
    next.closeOfflinePeriod(endTs);
    next.saveUser();
    set({ user: next });
  },

  resetPeriods: () => {
    const next = get().user.clone();
    const elapsedOfflineMs = next.periodList.computeTotalMs(Date.now());
    next.periodList.clearPeriods();
    next.offlinium = 0;
    next.offliniumSpentDuringOpenPeriod = 0;
    next.village.pendingCompanions = next.village.pendingCompanions.map(
      (pending) => ({
        ...pending,
        offlineMsAtStart: pending.offlineMsAtStart - elapsedOfflineMs,
      }),
    );
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
      user.closeOfflinePeriod(now);
    } else {
      user.periodList.openPeriodIfNeeded(now);
    }
    user.saveUser();
    set({ user });
    return user;
  },
}));
