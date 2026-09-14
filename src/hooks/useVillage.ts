import { useOnlineStatus } from "../stores/onlineStatusStore";

export function useVillage() {
  const { isOnline } = useOnlineStatus();

  return {
    isOnline
  };
}
