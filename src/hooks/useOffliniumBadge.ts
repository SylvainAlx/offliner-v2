import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";

export function useOffliniumBadge() {
  const { isOnline, totalOfflineMs } = useOnlineStatus();
  const user = useUser((state) => state.user);
  const currentOfflinium = user.getAvailableOfflinium(totalOfflineMs);

  return { isOnline, currentOfflinium };
}
