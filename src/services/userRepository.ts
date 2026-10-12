import { db } from "./database";
import { User } from "../models/user";

export type UserSnapshot = Record<string, unknown> | unknown[];

function serializeUser(user: User): Record<string, unknown> {
  return JSON.parse(JSON.stringify(user)) as Record<string, unknown>;
}

function serializeSnapshot(snapshot: unknown): UserSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as UserSnapshot;
}

export const userRepository = {
  async load(): Promise<User> {
    const stored = await db.profiles.get("current");
    const user = new User();

    if (stored) user.loadFromSnapshot(stored.data);

    return user;
  },

  async save(user: User): Promise<void> {
    await db.profiles.put({
      id: "current",
      schemaVersion: 1,
      updatedAt: Date.now(),
      data: serializeUser(user),
    });
  },

  async exportSnapshot(): Promise<unknown | null> {
    const stored = await db.profiles.get("current");
    return stored?.data ?? null;
  },

  async importSnapshot(snapshot: unknown): Promise<void> {
    await db.profiles.put({
      id: "current",
      schemaVersion: 1,
      updatedAt: Date.now(),
      data: serializeSnapshot(snapshot),
    });
  },

  async clear(): Promise<void> {
    await db.profiles.delete("current");
  },
};
