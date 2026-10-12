import Dexie, { type Table } from "dexie";

export interface StoredProfile {
  id: "current";
  schemaVersion: 1;
  updatedAt: number;
  data: unknown;
}

export interface StorageMeta {
  key: string;
  value: string;
}

class OfflinerDatabase extends Dexie {
  profiles!: Table<StoredProfile, string>;
  meta!: Table<StorageMeta, string>;

  constructor() {
    super("offliner");

    this.version(1).stores({
      profiles: "id",
      meta: "key",
    });
  }
}

export const db = new OfflinerDatabase();
