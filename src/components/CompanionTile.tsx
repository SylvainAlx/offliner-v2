import type { Companion } from "../models/companion";
import { useUser } from "../stores/userStore";
import "../styles/CompanionTile.css";
import Button from "./ui/Button";

interface CompanionProps {
  companion: Companion;
}

export default function CompanionTile({ companion }: CompanionProps) {
  const releaseCompanionAndGetOfflinium = useUser(
    (state) => state.releaseCompanionAndGetOfflinium,
  );

  return (
    <li className="companion-item" key={companion.id}>
      <span className="companion-avatar" aria-hidden="true">
        ✦
      </span>
      <span className="companion-details">
        <strong>{companion.name}</strong>
        <span>
          Invoqué le {new Date(companion.birthdate).toLocaleDateString("fr-FR")}
        </span>
      </span>
      <div className="companion-actions">
        <Button onClick={() => companion.sayHello()}>👋​</Button>
        <Button
          onClick={() => releaseCompanionAndGetOfflinium(companion.id)}
          color="var(--red-bg)"
        >
          ❌​
        </Button>
      </div>
    </li>
  );
}
