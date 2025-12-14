import { normalizeSpaces, parseDate, safeNumber } from "./utils";
import type { Step, TableRow } from "./types";

export function applyStep(step: Step, data: TableRow[]): TableRow[] {
  switch (step.tool) {
    case "trim":
      return data.map((row) => {
        const value = row[step.column ?? ""] ?? "";
        const mode = step.params?.mode as string | undefined;
        let cleaned = normalizeSpaces(value);
        if (mode === "lower") cleaned = cleaned.toLowerCase();
        if (mode === "upper") cleaned = cleaned.toUpperCase();
        if (mode === "title") cleaned = cleaned.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
        return { ...row, [step.column ?? ""]: cleaned };
      });
    case "replace":
      return data.map((row) => {
        const value = row[step.column ?? ""] ?? "";
        const from = step.params?.from ?? "";
        const to = step.params?.to ?? "";
        return { ...row, [step.column ?? ""]: value.split(from).join(to) };
      });
    case "changeType": {
      const targetType = step.params?.type as string;
      return data.map((row) => {
        const value = row[step.column ?? ""] ?? "";
        if (targetType === "number") {
          const num = safeNumber(value);
          return { ...row, [step.column ?? ""]: num === null ? "" : String(num) };
        }
        if (targetType === "date") {
          const formatted = parseDate(value);
          return { ...row, [step.column ?? ""]: formatted ?? "" };
        }
        return { ...row, [step.column ?? ""]: value };
      });
    }
    case "removeDuplicates": {
      const seen = new Set<string>();
      return data.filter((row) => {
        const key = row[step.column ?? ""] ?? "";
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    case "handleNulls": {
      const mode = step.params?.mode as string;
      const fill = step.params?.fill ?? "";
      if (mode === "remove") {
        return data.filter((row) => {
          const value = row[step.column ?? ""];
          return value !== undefined && value !== null && String(value).trim() !== "";
        });
      }
      return data.map((row) => {
        const value = row[step.column ?? ""];
        if (value === undefined || value === null || String(value).trim() === "") {
          return { ...row, [step.column ?? ""]: fill };
        }
        return row;
      });
    }
    case "split": {
      const delimiter = step.params?.delimiter ?? ",";
      const leftLabel = step.params?.left ?? "Left";
      const rightLabel = step.params?.right ?? "Right";
      return data.map((row) => {
        const value = row[step.column ?? ""] ?? "";
        const [first, second = ""] = value.split(delimiter);
        const newRow = { ...row } as TableRow;
        delete newRow[step.column ?? ""];
        return { ...newRow, [leftLabel]: first?.trim() ?? "", [rightLabel]: second?.trim() ?? "" };
      });
    }
    default:
      return data;
  }
}

export function reapplySteps(original: TableRow[], steps: Step[]): TableRow[] {
  return steps.reduce((acc, step) => applyStep(step, acc), original);
}
