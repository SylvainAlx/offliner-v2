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
    <Modal isOpen={isOpen} title={title} message={message} onClose={onClose}>
      <div className="flex justify-end gap-2 mt-5">
        <button
          type="button"
          className="min-h-10 px-3.5 py-2 border border-gray-200 rounded-[10px] bg-gray-50 text-gray-700 text-[0.8rem] font-bold cursor-pointer hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
          onClick={onClose}
          autoFocus
        >
          {closeLabel}
        </button>
      </div>
    </Modal>
  );
}
