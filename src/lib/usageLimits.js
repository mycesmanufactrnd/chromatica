export const TIER_LIMITS = {
  free: { upload: 5, recolor: 10, refashion: 10, gallery: 50 },
  pro: { upload: 50, recolor: 100, refashion: 100, gallery: Infinity },
};

export const PRO_PRICE = 2.99;

const COUNT_FIELD = {
  upload: "upload_count",
  recolor: "recolor_count",
  refashion: "refashion_count",
};

export function getLimit(tier, type) {
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
  return limits[type] ?? 0;
}

export function isUnlimited(tier, type) {
  return getLimit(tier, type) === Infinity;
}

export function getUsage(user, type) {
  return Number(user?.[COUNT_FIELD[type]] || 0);
}

export function remaining(user, type) {
  return Math.max(0, getLimit(user?.tier || "free", type) - getUsage(user, type));
}

export function canPerform(user, type) {
  return getUsage(user, type) < getLimit(user?.tier || "free", type);
}

export function nextCount(user, type) {
  return getUsage(user, type) + 1;
}