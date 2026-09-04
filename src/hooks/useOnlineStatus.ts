import { useState, useEffect, useCallback, useRef } from "react";

import type { OfflinePeriod } from "../utils/interfaces";

interface OnlineStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  offlinePeriods: OfflinePeriod[];
  totalOfflineMs: number;
  resetTracking: () => void;
}

const STORAGE_KEY = "offliner:periods";

function loadPeriods(): OfflinePeriod[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as OfflinePeriod[];
    return [];
  } catch {
    return [];
  }
}

function savePeriods(periods: OfflinePeriod[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  } catch {
    // ignore write errors
  }
}

function computeTotalMs(periods: OfflinePeriod[], now: number): number {
  return periods.reduce((total, p) => {
    const end = p.end ?? now;
    const dur = end - p.start;
    return total + Math.max(0, dur);
  }, 0);
}

function closeAnyOpenPeriod(
  periods: OfflinePeriod[],
  endTs: number,
): OfflinePeriod[] {
  const openIdx = periods.findIndex((p) => p.end === null);
  if (openIdx === -1) return periods;
  const updated = periods.slice();
  updated[openIdx] = { ...updated[openIdx], end: endTs };
  return updated;
}

function openPeriodIfNeeded(
  periods: OfflinePeriod[],
  startTs: number,
): OfflinePeriod[] {
  const hasOpen = periods.some((p) => p.end === null);
  if (hasOpen) return periods;
  return [...periods, { start: startTs, end: null }];
}

export function useOnlineStatus(): OnlineStatus {
  const [now0] = useState(() => Date.now());

  const initialOnline =
    typeof navigator !== "undefined" ? navigator.onLine : true;
  let initialPeriods = loadPeriods();

  if (initialOnline) {
    const hasOrphanOpen = initialPeriods.some((p) => p.end === null);
    if (hasOrphanOpen) {
      initialPeriods = closeAnyOpenPeriod(initialPeriods, now0);
      savePeriods(initialPeriods);
    }
  } else {
    const hasOpen = initialPeriods.some((p) => p.end === null);
    if (!hasOpen) {
      initialPeriods = [...initialPeriods, { start: now0, end: null }];
      savePeriods(initialPeriods);
    }
  }

  const startTicking = !initialOnline;

  const [isOnline, setIsOnline] = useState<boolean>(initialOnline);
  const [lastChecked, setLastChecked] = useState<Date | null>(new Date(now0));
  const [periods, setPeriods] = useState<OfflinePeriod[]>(initialPeriods);
  const [totalOfflineMs, setTotalOfflineMs] = useState<number>(
    computeTotalMs(initialPeriods, now0),
  );

  const tickRef = useRef<number | null>(null);

  const refreshTotalFromPeriods = useCallback(
    (currentPeriods: OfflinePeriod[]) => {
      setTotalOfflineMs(computeTotalMs(currentPeriods, Date.now()));
      setLastChecked(new Date());
    },
    [setTotalOfflineMs, setLastChecked],
  );

  const stopTick = useCallback(() => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = window.setInterval(() => {
      setPeriods((prev) => {
        setTotalOfflineMs(computeTotalMs(prev, Date.now()));
        setLastChecked(new Date());
        return prev;
      });
    }, 1000);
  }, [stopTick, setPeriods, setTotalOfflineMs, setLastChecked]);

  const resetTracking = useCallback(() => {
    const empty: OfflinePeriod[] = [];
    savePeriods(empty);
    setPeriods(empty);
    setTotalOfflineMs(0);
    setLastChecked(new Date());
  }, [setPeriods, setTotalOfflineMs, setLastChecked]);

  const goOnline = useCallback(() => {
    const now = Date.now();
    setPeriods((prev) => {
      const openIdx = prev.findIndex((p) => p.end === null);
      if (openIdx === -1) {
        refreshTotalFromPeriods(prev);
        return prev;
      }
      const updated = prev.map((p, i) =>
        i === openIdx ? { ...p, end: now } : p,
      );
      savePeriods(updated);
      setTotalOfflineMs(computeTotalMs(updated, now));
      setLastChecked(new Date());
      return updated;
    });
    setIsOnline(true);
    stopTick();
  }, [
    refreshTotalFromPeriods,
    stopTick,
    setPeriods,
    setTotalOfflineMs,
    setLastChecked,
    setIsOnline,
  ]);

  const goOffline = useCallback(() => {
    const now = Date.now();
    setPeriods((prev) => {
      const hasOpen = prev.some((p) => p.end === null);
      const updated = hasOpen ? prev : [...prev, { start: now, end: null }];
      savePeriods(updated);
      setTotalOfflineMs(computeTotalMs(updated, now));
      setLastChecked(new Date());
      return updated;
    });
    setIsOnline(false);
    startTick();
  }, [startTick, setPeriods, setTotalOfflineMs, setLastChecked, setIsOnline]);

  const persistOnHide = useCallback(() => {
    try {
      const snapshot = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      ) as OfflinePeriod[];
      const now = Date.now();
      if (!navigator.onLine) {
        const normalized = openPeriodIfNeeded(snapshot, now);
        savePeriods(normalized);
      } else {
        const normalized = closeAnyOpenPeriod(snapshot, now);
        savePeriods(normalized);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      persistOnHide();
      stopTick();
    } else {
      const now = Date.now();
      const online = navigator.onLine;
      let snapshot = loadPeriods();

      if (online) {
        snapshot = closeAnyOpenPeriod(snapshot, now);
      } else {
        snapshot = openPeriodIfNeeded(snapshot, now);
      }
      savePeriods(snapshot);
      setPeriods(snapshot);
      setIsOnline(online);
      setTotalOfflineMs(computeTotalMs(snapshot, now));
      setLastChecked(new Date(now));
      if (!online) startTick();
    }
  }, [
    persistOnHide,
    startTick,
    stopTick,
    setPeriods,
    setIsOnline,
    setTotalOfflineMs,
    setLastChecked,
  ]);

  useEffect(() => {
    if (startTicking) startTick();

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
  }, [
    goOnline,
    goOffline,
    handleVisibilityChange,
    persistOnHide,
    startTicking,
    startTick,
    stopTick,
  ]);

  return {
    isOnline,
    lastChecked,
    offlinePeriods: periods,
    totalOfflineMs,
    resetTracking,
  };
}
