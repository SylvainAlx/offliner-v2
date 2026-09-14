import { useEffect, useId } from "react";

export function useConfirmModal(isOpen: boolean, onCancel: () => void) {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  } else {
    return { messageId, titleId };
  }
}
