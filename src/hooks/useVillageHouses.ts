import { useUser } from "../stores/userStore";

export function useVillageHouses() {
  const user = useUser((state) => state.user);
  const { houses } = user.village;
  return {
    houses,
  };
}