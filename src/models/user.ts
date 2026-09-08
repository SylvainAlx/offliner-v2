import { OFFLINIUM_DELIVERY_INTERVAL, USER_KEY } from "../utils/constants";
import { PeriodList } from "./periodList";
import { Period } from "./period";

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
      let raw = localStorage.getItem(USER_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed) return;

      if (Array.isArray(parsed)) {
        this.periodList.loadPeriods(parsed);
        return;
      }

      if (typeof parsed.name === "string") this.name = parsed.name;
      if (typeof parsed.offlinium === "number") this.offlinium = parsed.offlinium;
      if (typeof parsed.createdAt === "number") this.createdAt = parsed.createdAt;

      const rawPeriods =
        parsed.periodList ??
        parsed.perdioList ??
        parsed.periods ??
        parsed.offlinePeriods;

      if (rawPeriods !== undefined && rawPeriods !== null) {
        this.periodList.loadPeriods(rawPeriods);
        this.extractOfflinium();
      }
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

  clone(): User {
    const copy = new User(this.name);
    copy.offlinium = this.offlinium;
    copy.createdAt = this.createdAt;
    copy.periodList = new PeriodList(
      this.periodList.periods.map((p) => new Period(p.start, p.end)),
    );
    return copy;
  }

  extractOfflinium(now?: number): void {
    const totalMs = this.periodList.computeTotalMs(now);
    this.offlinium = Math.floor(totalMs / OFFLINIUM_DELIVERY_INTERVAL);
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
