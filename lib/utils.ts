export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function safeNumber(value: string) {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

export function parseDate(value: string) {
  const normalized = value.replace(/\./g, "-").replace(/\//g, "-");
  const parts = normalized.split("-");
  let candidate = normalized;
  if (parts[0].length === 2) {
    candidate = `${parts[2]}-${parts[0]}-${parts[1]}`;
  }
  const date = new Date(candidate);
  return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}
