import type { Quiz } from "./client";

export type AvailabilityState = "not_yet" | "open" | "closed";

export function getAvailabilityState(quiz: Quiz, at = new Date()): AvailabilityState {
  if (quiz.availableFrom) {
    const from = new Date(quiz.availableFrom);
    if (!Number.isNaN(from.getTime()) && at < from) {
      return "not_yet";
    }
  }
  if (quiz.availableUntil) {
    const until = new Date(quiz.availableUntil);
    if (!Number.isNaN(until.getTime()) && at > until) {
      return "closed";
    }
  }
  return "open";
}

export function availabilityLabel(quiz: Quiz): string {
  const s = getAvailabilityState(quiz);
  if (s === "not_yet") return "Not available yet";
  if (s === "closed") return "Closed";
  return "Available";
}

export function formatShortDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
