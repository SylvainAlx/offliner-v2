import { useUser } from "../stores/userStore";
import "../styles/PopulationBadge.css";

export default function PopulationBadge() {
  const user = useUser((state) => state.user);
  const population = user.village.companions.length;
  const populationMax = user.village.companionCapacity;

  return (
    <div
      className="header-population-badge"
      role="img"
      title={`Population : ${population}/${populationMax}`}
      aria-label={`Population : ${population} compagnon${population > 1 ? "s" : ""} sur ${populationMax} places`}
    >
      <span className="population-icon" aria-hidden="true">
        🐾
      </span>
      <span className="population-count">
        {population}/{populationMax}
      </span>
    </div>
  );
}
