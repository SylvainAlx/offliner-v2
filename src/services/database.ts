import Dexie, { type Table } from "dexie";

export interface StoredProfile {
  id: "current";
  schemaVersion: 1;
  updatedAt: number;
  data: unknown;
}

class OfflinerDatabase extends Dexie {
  profiles!: Table<StoredProfile, string>;

  constructor() {
    super("offliner");

    this.version(1).stores({
      profiles: "id",
      meta: "key",
    });

    // Remove the metadata store used only by the one-time localStorage
    // migration. The profile data itself remains untouched.
    this.version(2).stores({
      profiles: "id",
      meta: null,
    });
  }
}

export const db = new OfflinerDatabase();
