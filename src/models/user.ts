import { USER_KEY } from "../utils/constants";
import { PeriodList } from "./periodList";

export class User {
  name: string;
  offlinium: number;
  periodList: PeriodList;
  createdAt: number;

  constructor(name: string = 'Offliner') {
    this.name = name;
    this.offlinium = 0;
    this.periodList = new PeriodList();
    this.createdAt = Date.now();
  }

  loadUser(): void {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.name === "string") this.name = parsed.name;
      if (typeof parsed.offlinium === "number") this.offlinium = parsed.offlinium;
      if (typeof parsed.periodList === "object") this.periodList.loadPeriods(parsed.periodList);
      if (typeof parsed.createdAt === "number") this.createdAt = parsed.createdAt;
    } catch {
      return;
    }
  }

  saveUser(): void {
    try {
      const raw = JSON.stringify(this);
      localStorage.setItem(USER_KEY, raw);
    } catch {
      return;
    }
  }

  addOfflinium(amount: number): void {
    if (amount < 0) {
      throw new Error("L'amount doit être supérieur à 0.");
    } else {
      this.offlinium += amount;
    }
  }

  removeOfflinium(amount: number): void {
    if (amount < 0) {
      throw new Error("L'amount doit être supérieur à 0.");
    } else if (this.offlinium - amount < 0) {
      throw new Error("Pas assez d'offlinium.");
    } else {
      this.offlinium -= amount;
    }
  }
}
