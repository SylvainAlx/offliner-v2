import { useEffect, useState } from "react";
import type { Companion } from "../models/companion";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";

export function useCompanionTile(companion: Companion) {
  const [isSpriteOpen, setIsSpriteOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const user = useUser((state) => state.user);
  const evolveCompanion = useUser((state) => state.evolveCompanion);
  const releaseCompanionAndGetOfflinium = useUser(
    (state) => state.releaseCompanionAndGetOfflinium,
  );
  const { totalOfflineMs } = useOnlineStatus();
  const evolutionCost = companion.evolutionCost;
  const canEvolve =
    companion.canEvolve() &&
    user.getAvailableOfflinium(totalOfflineMs) >= evolutionCost;

  function handleEvolution() {
    evolveCompanion(companion.id, totalOfflineMs);
    setIsEvolutionModalOpen(false);
  }

  useEffect(() => {
    if (!isSpriteOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSpriteOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSpriteOpen]);

  return {
    isSpriteOpen,
    setIsSpriteOpen,
    isReleaseModalOpen,
    setIsReleaseModalOpen,
    isEvolutionModalOpen,
    setIsEvolutionModalOpen,
    evolutionCost,
    canEvolve,
    handleEvolution,
    releaseCompanionAndGetOfflinium,
  };
}
