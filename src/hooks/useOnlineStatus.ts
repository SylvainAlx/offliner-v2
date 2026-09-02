import { useState, useEffect, useCallback, useRef } from "react";

export interface OfflinePeriod {
  start: number;
  end: number | null;
}

export interface OnlineStatus {
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
    // ignore
  }
}

function computeTotalMs(periods: OfflinePeriod[], now: number): number {
  return periods.reduce((total, p) => {
    const end = p.end ?? now;
    const dur = end - p.start;
    return total + Math.max(0, dur);
  }, 0);
}

export function useOnlineStatus(): OnlineStatus {
  const initialOnline =
    typeof navigator !== "undefined" ? navigator.onLine : true;
  const initialPeriods = loadPeriods();
  const initialNow = Date.now();

  const [isOnline, setIsOnline] = useState<boolean>(initialOnline);
  const [lastChecked, setLastChecked] = useState<Date | null>(new Date());
  const [periods, setPeriods] = useState<OfflinePeriod[]>(initialPeriods);
  const [totalOfflineMs, setTotalOfflineMs] = useState<number>(
    computeTotalMs(initialPeriods, initialNow),
  );

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
      setTotalOfflineMs((prev) => prev + 1000);
    }, 1000);
  }, [stopTick]);

  const resetTracking = useCallback(() => {
    const empty: OfflinePeriod[] = [];
    savePeriods(empty);
    setPeriods(empty);
    setTotalOfflineMs(0);
  }, []);

  const goOnline = useCallback(() => {
    const now = Date.now();
    setPeriods((prev) => {
      const openIdx = prev.findIndex((p) => p.end === null);
      if (openIdx === -1) return prev;
      const updated = prev.map((p, i) =>
        i === openIdx ? { ...p, end: now } : p,
      );
      savePeriods(updated);
      setTotalOfflineMs(computeTotalMs(updated, now));
      return updated;
    });
    setIsOnline(true);
    setLastChecked(new Date());
    stopTick();
  }, [stopTick]);

  const goOffline = useCallback(() => {
    const now = Date.now();
    setPeriods((prev) => {
      const hasOpen = prev.some((p) => p.end === null);
      const updated = hasOpen ? prev : [...prev, { start: now, end: null }];
      savePeriods(updated);
      setTotalOfflineMs(computeTotalMs(updated, now));
      return updated;
    });
    setIsOnline(false);
    setLastChecked(new Date());
    startTick();
  }, [startTick]);

  useEffect(() => {
    if (!initialOnline) {
      const hasOpen = initialPeriods.some((p) => p.end === null);
      if (!hasOpen) {
        const now = Date.now();
        const updated = [...initialPeriods, { start: now, end: null }];
        savePeriods(updated);
        setPeriods(updated);
        setTotalOfflineMs(computeTotalMs(updated, now));
      }
      startTick();
    }

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      stopTick();
    };
  }, [goOnline, goOffline, initialOnline, initialPeriods, startTick, stopTick]);

  return {
    isOnline,
    lastChecked,
    offlinePeriods: periods,
    totalOfflineMs,
    resetTracking,
  };
}
