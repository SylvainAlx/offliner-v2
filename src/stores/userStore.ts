import { create } from "zustand";
import { User } from "../models/user";
import {
  COMPANION_INVOCATION_COST,
  HOUSE_CONSTRUCTION_COST,
} from "../utils/constants";

export interface UserStore {
  user: User;
  updateName: (name: string) => void;
  openPeriodIfNeeded: (startTs: number) => void;
  closeAnyOpenPeriod: (endTs: number) => void;
  resetPeriods: () => void;
  saveUser: () => void;
  buildHouse: (offlineMs: number) => boolean;
  invokeCompanion: (offlineMs: number) => boolean;
  releaseCompanionAndGetOfflinium: (companionId: string) => boolean;
  cancelCompanionInvocation: (companionId: string, offlineMs: number) => boolean;
  completeCompanionInvocations: (offlineMs: number) => void;
  completePendingElements: (offlineMs: number) => void;
  cancelPendingElement: (elementId: string, offlineMs: number) => boolean;
  reloadUser: () => User;
  syncWithStorage: (online: boolean, now: number) => User;
}

function createInitialUser(): User {
  const user = new User();
  user.loadUser();

  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  const now = Date.now();
  user.discardOpenPeriod();
  if (!isOnline) user.periodList.openPeriodIfNeeded(now);
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

  buildHouse: (offlineMs) => {
    const next = get().user.clone();
    const spend = next.spendOfflinium(HOUSE_CONSTRUCTION_COST, offlineMs);
    if (!spend) return false;

    next.village.addPendingElement(
      "house",
      offlineMs,
      spend.stored,
      spend.openPeriod,
    );
    next.saveUser();
    set({ user: next });
    return true;
  },

  invokeCompanion: (offlineMs) => {
    const next = get().user.clone();
    if (!next.village.canInvokeCompanion()) return false;

    const spend = next.spendOfflinium(COMPANION_INVOCATION_COST, offlineMs);
    if (!spend) {
      return false;
    }
    next.village.addPendingElement(
      "companion",
      offlineMs,
      spend.stored,
      spend.openPeriod,
    );
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

  cancelCompanionInvocation: (companionId, offlineMs) => {
    const next = get().user.clone();
    if (!next.cancelCompanionInvocation(companionId, offlineMs)) {
      return false;
    }

    next.saveUser();
    set({ user: next });
    return true;
  },

  completeCompanionInvocations: (offlineMs) => {
    get().completePendingElements(offlineMs);
  },

  completePendingElements: (offlineMs) => {
    const next = get().user.clone();
    if (next.village.completePendingElements(offlineMs) === 0) return;

    next.saveUser();
    set({ user: next });
  },

  cancelPendingElement: (elementId, offlineMs) => {
    const next = get().user.clone();
    if (!next.cancelPendingElement(elementId, offlineMs)) return false;

    next.saveUser();
    set({ user: next });
    return true;
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
    next.village.pendingElements = next.village.pendingElements.map(
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
