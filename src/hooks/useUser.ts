import { useState, useCallback } from "react";
import { User } from "../models/user";

export function useUser() {
  const [user, setUser] = useState<User>(() => {
    const u = new User();
    u.loadUser();
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    const now = Date.now();
    if (isOnline) {
      u.periodList.closeAnyOpenPeriod(now);
    } else {
      u.periodList.openPeriodIfNeeded(now);
    }
    u.saveUser();
    return u;
  });

  const saveUser = useCallback(() => {
    user.saveUser();
  }, [user]);

  const openPeriodIfNeeded = useCallback((startTs: number) => {
    setUser((prev) => {
      const next = prev.clone();
      next.periodList.openPeriodIfNeeded(startTs);
      next.extractOfflinium(startTs);
      next.saveUser();
      return next;
    });
  }, []);

  const closeAnyOpenPeriod = useCallback((endTs: number) => {
    setUser((prev) => {
      const next = prev.clone();
      next.periodList.closeAnyOpenPeriod(endTs);
      next.extractOfflinium(endTs);
      next.saveUser();
      return next;
    });
  }, []);

  const resetPeriods = useCallback(() => {
    setUser((prev) => {
      const next = prev.clone();
      next.periodList.clearPeriods();
      next.offlinium = 0;
      next.saveUser();
      return next;
    });
  }, []);

  const reloadUser = useCallback((): User => {
    const u = new User();
    u.loadUser();
    setUser(u);
    return u;
  }, []);

  const syncWithStorage = useCallback((online: boolean, now: number): User => {
    const u = new User();
    u.loadUser();
    if (online) {
      u.periodList.closeAnyOpenPeriod(now);
    } else {
      u.periodList.openPeriodIfNeeded(now);
    }
    u.saveUser();
    setUser(u);
    return u;
  }, []);

  return {
    user,
    openPeriodIfNeeded,
    closeAnyOpenPeriod,
    resetPeriods,
    saveUser,
    reloadUser,
    syncWithStorage,
  };
}
