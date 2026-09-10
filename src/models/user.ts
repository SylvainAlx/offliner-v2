import { OFFLINIUM_DELIVERY_INTERVAL, USER_KEY } from "../utils/constants";
import { PeriodList } from "./periodList";
import { Period } from "./period";
import { readStorage, writeStorage } from "../services/storage";

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
      const parsed = readStorage<unknown>(USER_KEY, null);
      if (!parsed) return;

      if (Array.isArray(parsed)) {
        this.periodList.loadPeriods(parsed);
        return;
      }

      if (typeof parsed !== "object" || parsed === null) return;
      const record = parsed as Record<string, unknown>;

      if (typeof record.name === "string") this.name = record.name;
      if (typeof record.offlinium === "number") this.offlinium = record.offlinium;
      if (typeof record.createdAt === "number") this.createdAt = record.createdAt;

      const rawPeriods =
        record.periodList ??
        record.perdioList ??
        record.periods ??
        record.offlinePeriods;

      if (rawPeriods !== undefined && rawPeriods !== null) {
        this.periodList.loadPeriods(rawPeriods);
        this.extractOfflinium();
      }
    } catch {
      return;
    }
  }

  saveUser(): void {
    writeStorage(USER_KEY, this);
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
