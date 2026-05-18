import type { SuitabilityClass } from "@/types";

export function getSuitabilityClass(score: number): SuitabilityClass {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  if (score >= 30) return "Low";
  return "Not Recommended";
}

export function scoreColor(score: number) {
  if (score >= 90) return "#1F5E3B";
  if (score >= 75) return "#2D9CDB";
  if (score >= 50) return "#DFAF37";
  if (score >= 30) return "#D97706";
  return "#B91C1C";
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
