import Modal from "./Modal";

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  closeLabel?: string;
  onClose: () => void;
}

export default function InfoModal({
  isOpen,
  title,
  message,
  closeLabel = "Fermer",
  onClose,
}: InfoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      message={message}
      onClose={onClose}
    >
      <div className="modal-actions">
        <button
          type="button"
          className="modal-button modal-button-cancel"
          onClick={onClose}
          autoFocus
        >
          {closeLabel}
        </button>
      </div>
    </Modal>
  );
}
