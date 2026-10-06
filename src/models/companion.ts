import { names, animals, uniqueNamesGenerator } from "unique-names-generator";
import {
  COMPANION_EVOLUTION_COSTS,
  COMPANION_STAGE_HARVEST_BONUS,
} from "../utils/constants";

export const COMPANION_STAGES = [
  "child",
  "adolescent",
  "adult",
  "sage",
] as const;

export type CompanionStage = (typeof COMPANION_STAGES)[number];

export const COMPANION_STAGE_LABELS: Record<CompanionStage, string> = {
  child: "Enfant",
  adolescent: "Adolescent",
  adult: "Adulte",
  sage: "Sage",
};

export class Companion {
  id: string;
  name: string;
  birthdate: number;
  stage: CompanionStage;

  constructor() {
    const firstName: string = uniqueNamesGenerator({
      dictionaries: [names],
    });
    const lastName: string = uniqueNamesGenerator({
      dictionaries: [animals],
      style: "capital",
    });

    this.id = crypto.randomUUID();
    this.name = `${firstName} ${lastName}`;
    this.birthdate = Date.now();
    this.stage = "child";
  }

  get stageLabel(): string {
    return COMPANION_STAGE_LABELS[this.stage];
  }

  get harvestBonus(): number {
    if (this.stage === "child") return 0;
    return COMPANION_STAGE_HARVEST_BONUS[this.stage];
  }

  get nextStage(): CompanionStage | undefined {
    const currentIndex = COMPANION_STAGES.indexOf(this.stage);
    if (currentIndex < 0) return;
    return COMPANION_STAGES[currentIndex + 1];
  }

  get evolutionCost(): number {
    const nextStage = this.nextStage;
    if (!nextStage || nextStage === "child") return 0;
    return COMPANION_EVOLUTION_COSTS[nextStage];
  }

  canEvolve(): boolean {
    return this.nextStage !== undefined;
  }

  evolve(): boolean {
    const nextStage = this.nextStage;
    if (!nextStage) return false;

    this.stage = nextStage;
    return true;
  }
}
