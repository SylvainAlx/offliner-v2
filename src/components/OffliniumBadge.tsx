import { useOffliniumBadge } from "../hooks/useOffliniumBadge";

export default function OffliniumBadge() {
  const { isOnline, currentOfflinium } = useOffliniumBadge();

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-(--gray-200) bg-white px-3 py-1.5 shadow-(--shadow-sm) transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        !isOnline
          ? "border-[rgba(170,59,255,0.4)] bg-[rgba(245,235,255,0.8)] shadow-[0_0_12px_rgba(170,59,255,0.2)]"
          : ""
      }`}
    >
      <span className="text-[1.1rem] leading-none text-(--accent)">⬡</span>
      <span className="font-(--mono) text-base text-(--gray-900)">
        {currentOfflinium}
      </span>
    </div>
  );
}
