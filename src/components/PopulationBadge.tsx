import { useUser } from "../stores/userStore";

export default function PopulationBadge() {
  const user = useUser((state) => state.user);
  const population = user.village.companions.length;
  const populationMax = user.village.companionCapacity;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-(--gray-200) bg-white px-3 py-1.5 shadow-(--shadow-sm)"
      role="img"
      title={`Population : ${population}/${populationMax}`}
      aria-label={`Population : ${population} compagnon${population > 1 ? "s" : ""} sur ${populationMax} places`}
    >
      <span className="text-[1.1rem] leading-none text-(--green-dark)" aria-hidden="true">
        🐾
      </span>
      <span className="font-[var(--mono)] text-base font-extrabold text-(--gray-900)">
        {population}/{populationMax}
      </span>
    </div>
  );
}
