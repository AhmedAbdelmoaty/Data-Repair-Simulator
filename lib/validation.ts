import type { ValidationResult, TableRow } from "./types";
import { normalizeSpaces, parseDate, safeNumber } from "./utils";

export function runValidation(rows: TableRow[]): ValidationResult[] {
  const orderIds = new Set<string>();
  let unique = true;
  let revenueValid = true;
  let revenueNull = false;
  let quantityPositive = true;
  let dateValid = true;
  let channelValid = true;

  rows.forEach((row) => {
    const id = row["OrderID"] ?? "";
    if (orderIds.has(id)) unique = false;
    orderIds.add(id);

    const revenueValue = row["Revenue"] ?? "";
    if (revenueValue === "") revenueNull = true;
    const num = safeNumber(revenueValue);
    if (num === null) revenueValid = false;

    const qty = safeNumber(row["Quantity"] ?? "");
    if (qty === null || qty <= 0) quantityPositive = false;

    const date = parseDate(row["OrderDate"] ?? "");
    if (!date) dateValid = false;

    const channel = normalizeSpaces((row["Channel"] ?? "").toLowerCase());
    if (!['online', 'store', 'partner'].includes(channel)) channelValid = false;
  });

  const results: ValidationResult[] = [
    {
      key: "orderId",
      passed: unique,
      title: "OrderID unique",
      hint: unique ? "" : "أزل التكرارات في عمود OrderID / Remove duplicates in OrderID"
    },
    {
      key: "revenue",
      passed: revenueValid && !revenueNull,
      title: "Revenue numeric",
      hint: revenueValid && !revenueNull ? "" : "حوّل الإيرادات لأرقام واملأ القيم الناقصة / Convert revenue to numbers and fill blanks"
    },
    {
      key: "quantity",
      passed: quantityPositive,
      title: "Quantity positive",
      hint: quantityPositive ? "" : "تأكد أن الكميات أكبر من صفر / Ensure quantities are positive"
    },
    {
      key: "date",
      passed: dateValid,
      title: "OrderDate valid",
      hint: dateValid ? "" : "وحّد تنسيق التاريخ في عمود OrderDate / Standardize OrderDate format"
    },
    {
      key: "channel",
      passed: channelValid,
      title: "Channel normalized",
      hint: channelValid ? "" : "نظّف قيم القناة لتكون Online أو Store أو Partner"
    }
  ];

  return results;
}

export function computeGrade(steps: number): "A" | "B" | "C" {
  if (steps <= 6) return "A";
  if (steps <= 9) return "B";
  return "C";
}
