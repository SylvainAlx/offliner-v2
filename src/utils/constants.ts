export const USER_KEY = "offliner:user";
export const OFFLINIUM_DELIVERY_INTERVAL = 10 * 1000;
export const COMPANION_INVOCATION_COST = 60 * 6;
export const COMPANION_EVOLUTION_COSTS = {
  adolescent: 360,
  adult: 720,
  sage: 1440,
} as const;
export const COMPANION_STAGE_HARVEST_BONUS = {
  adolescent: 1,
  adult: 2,
  sage: 3,
} as const;
export const COMPANION_INVOCATION_OFFLINE_MS = 60 * 1000;
export const HOUSE_CONSTRUCTION_COST = 120 * 6;
export const HOUSE_CONSTRUCTION_OFFLINE_MS = 2 * 60 * 1000;
export const COMPANIONS_PER_HOUSE = 4;
