import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "../models/user";
import { useUserContext } from "./useUserContext";

export interface OnlineStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  totalOfflineMs: number;
  resetTracking: () => void;
}

function persistDirectly(now: number, isOnline: boolean): void {
  try {
    const u = new User();
    u.loadUser();
    if (!isOnline) {
      u.periodList.openPeriodIfNeeded(now);
    } else {
      u.periodList.closeAnyOpenPeriod(now);
    }
    u.saveUser();
  } catch {
    // ignore write errors
  }
}

export function useOnlineStatus(): OnlineStatus {
  const {
    user,
    openPeriodIfNeeded,
    closeAnyOpenPeriod,
    resetPeriods,
    syncWithStorage,
  } = useUserContext();

  const initialOnline =
    typeof navigator !== "undefined" ? navigator.onLine : true;

  const [isOnline, setIsOnline] = useState<boolean>(initialOnline);
  const [lastChecked, setLastChecked] = useState<Date | null>(() => new Date());
  const [totalOfflineMs, setTotalOfflineMs] = useState<number>(() =>
    user.periodList.computeTotalMs(Date.now()),
  );

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
    setTotalOfflineMs(user.periodList.computeTotalMs(Date.now()));
  }, [user]);

  const tickRef = useRef<number | null>(null);

  const stopTick = useCallback(() => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = window.setInterval(() => {
      setTotalOfflineMs(userRef.current.periodList.computeTotalMs(Date.now()));
      setLastChecked(new Date());
    }, 1000);
  }, [stopTick]);

  const resetTracking = useCallback(() => {
    resetPeriods();
    setTotalOfflineMs(0);
    setLastChecked(new Date());
  }, [resetPeriods]);

  const goOnline = useCallback(() => {
    const now = Date.now();
    closeAnyOpenPeriod(now);
    setIsOnline(true);
    setLastChecked(new Date(now));
    stopTick();
  }, [closeAnyOpenPeriod, stopTick]);

  const goOffline = useCallback(() => {
    const now = Date.now();
    openPeriodIfNeeded(now);
    setIsOnline(false);
    setLastChecked(new Date(now));
    startTick();
  }, [openPeriodIfNeeded, startTick]);

  const handlePersistOnHide = useCallback(() => {
    persistDirectly(Date.now(), navigator.onLine);
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      handlePersistOnHide();
      stopTick();
    } else {
      const now = Date.now();
      const online = navigator.onLine;
      const updatedUser = syncWithStorage(online, now);
      setIsOnline(online);
      setTotalOfflineMs(updatedUser.periodList.computeTotalMs(now));
      setLastChecked(new Date(now));
      if (!online) startTick();
    }
  }, [handlePersistOnHide, stopTick, syncWithStorage, startTick]);

  useEffect(() => {
    if (!initialOnline) {
      startTick();
    }

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePersistOnHide);
    window.addEventListener("beforeunload", handlePersistOnHide);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePersistOnHide);
      window.removeEventListener("beforeunload", handlePersistOnHide);
      stopTick();
    };
  }, [
    initialOnline,
    goOnline,
    goOffline,
    handleVisibilityChange,
    handlePersistOnHide,
    startTick,
    stopTick,
  ]);

  return {
    isOnline,
    lastChecked,
    totalOfflineMs,
    resetTracking,
  };
}
