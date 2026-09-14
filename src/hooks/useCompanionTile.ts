import { useEffect, useState } from "react";
import { useUser } from "../stores/userStore";

export function useCompanionTile() {
  const [isSpriteOpen, setIsSpriteOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const releaseCompanionAndGetOfflinium = useUser(
    (state) => state.releaseCompanionAndGetOfflinium,
  );

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
    releaseCompanionAndGetOfflinium,
  };
}
