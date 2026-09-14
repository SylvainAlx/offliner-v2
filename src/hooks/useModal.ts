import { useEffect, useId } from "react";

export function useModal(isOpen: boolean, onClose: () => void) {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return { messageId, titleId };
}
