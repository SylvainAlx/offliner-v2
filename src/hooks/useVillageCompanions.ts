import { useUser } from "../stores/userStore";

export function useVillageCompanions() {
  const user = useUser((state) => state.user);
  const { houses, companions } = user.village;
  const companionCapacity = user.village.companionCapacity;

  return {
    houses,
    companions,
    companionCapacity,
  };
}