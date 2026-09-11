export class House {
  id: string;
  builtAt: number;

  constructor() {
    this.id = crypto.randomUUID();
    this.builtAt = Date.now();
  }
}
