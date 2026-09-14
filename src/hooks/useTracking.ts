import { useMemo, useState } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";

export function useTracking() {
  const { resetTracking, lastChecked } = useOnlineStatus();
  const { user } = useUser();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

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
    isResetModalOpen,
    setIsResetModalOpen,
    resetTracking,
  };
}
