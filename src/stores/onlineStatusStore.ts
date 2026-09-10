import { create } from "zustand";
import { User } from "../models/user";
import { useUser } from "./userStore";

export interface OnlineStatusStore {
  isOnline: boolean;
  lastChecked: Date | null;
  totalOfflineMs: number;
  resetTracking: () => void;
  initialize: () => () => void;
}

function getInitialOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

function persistDirectly(now: number, isOnline: boolean): void {
  try {
    const user = new User();
    user.loadUser();
    if (isOnline) {
      user.periodList.closeAnyOpenPeriod(now);
    } else {
      user.periodList.openPeriodIfNeeded(now);
    }
    user.saveUser();
  } catch {
    // Persistence must not prevent the page lifecycle from completing.
  }
}

export const useOnlineStatus = create<OnlineStatusStore>((set, get) => ({
  isOnline: getInitialOnline(),
  lastChecked: new Date(),
  totalOfflineMs: useUser
    .getState()
    .user.periodList.computeTotalMs(Date.now()),

  resetTracking: () => {
    if (
      window.confirm(
        "Cette action va supprimer l'historique complet de vos périodes de déconnexion. Continuer?",
      )
    ) {
      useUser.getState().resetPeriods();
      set({ totalOfflineMs: 0, lastChecked: new Date() });
    }
  },

  initialize: () => {
    let tick: number | null = null;
    const stopTick = () => {
      if (tick !== null) {
        window.clearInterval(tick);
        tick = null;
      }
    };
    const startTick = () => {
      stopTick();
      tick = window.setInterval(() => {
        const user = useUser.getState().user;
        set({
          totalOfflineMs: user.periodList.computeTotalMs(Date.now()),
          lastChecked: new Date(),
        });
      }, 1000);
    };
    const goOnline = () => {
      const now = Date.now();
      useUser.getState().closeAnyOpenPeriod(now);
      set({ isOnline: true, lastChecked: new Date(now) });
      stopTick();
    };
    const goOffline = () => {
      const now = Date.now();
      useUser.getState().openPeriodIfNeeded(now);
      set({ isOnline: false, lastChecked: new Date(now) });
      startTick();
    };
    const persistOnHide = () => {
      persistDirectly(Date.now(), navigator.onLine);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persistOnHide();
        stopTick();
        return;
      }

      const now = Date.now();
      const online = navigator.onLine;
      const user = useUser.getState().syncWithStorage(online, now);
      set({
        isOnline: online,
        totalOfflineMs: user.periodList.computeTotalMs(now),
        lastChecked: new Date(now),
      });
      if (!online) startTick();
    };

    if (!get().isOnline) startTick();
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", persistOnHide);
    window.addEventListener("beforeunload", persistOnHide);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", persistOnHide);
      window.removeEventListener("beforeunload", persistOnHide);
      stopTick();
    };
  },
}));
