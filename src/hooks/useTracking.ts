import { useMemo } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";

export function useTracking() {
  const { lastChecked } = useOnlineStatus();
  const { user } = useUser();

  const nowRef = useMemo(
    () => ({ now: lastChecked ? lastChecked.getTime() : 0 }),
    [lastChecked],
  );
  const now = nowRef.now;
  const { completedDays, openPeriod } = useMemo(() => {
    return {
      completedDays: user.periodList.days,
      openPeriod: user.periodList.getOpenPeriod(),
    };
  }, [user]);

  return {
    completedDays,
    openPeriod,
    now,
  };
}
