import type { DietItem, SleepEntry } from "@/types/domain";

const DIET_ORDER: Record<DietItem["type"], number> = {
  mandatory: 0,
  recommended: 1,
  "not-allowed": 2,
};

export const sortDietItems = (items: DietItem[]) =>
  [...items].sort((left, right) => DIET_ORDER[left.type] - DIET_ORDER[right.type]);

export const dietClassName = (type: DietItem["type"]) => {
  if (type === "mandatory") {
    return "diet-mandatory";
  }
  if (type === "recommended") {
    return "diet-recommended";
  }
  return "diet-not-allowed";
};

export const truncateWords = (value: string, limit: number) => {
  const parts = value.trim().split(/\s+/);
  if (parts.length <= limit) {
    return value;
  }
  return `${parts.slice(0, limit).join(" ")}...`;
};

export const formatCountdown = (isoValue: string) => {
  const now = new Date();
  const target = new Date(isoValue);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Due now";
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours === 0) {
    return `In ${diffMinutes}m`;
  }

  return `In ${diffHours}h ${diffMinutes}m`;
};

export const formatSleepStatus = (entry: SleepEntry, targetHours: number) =>
  entry.hours >= targetHours ? "text-emerald-600" : "text-rose-600";
