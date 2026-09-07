export class Period {
  start: number;
  end: number | null;

  constructor(start: number, end: number | null = null) {
    this.start = start;
    this.end = end;
  }

  getPeriodDurationMs(now: number): number {
    const end = this.end ?? now;
    return Math.max(0, end - this.start);
  }
  
}