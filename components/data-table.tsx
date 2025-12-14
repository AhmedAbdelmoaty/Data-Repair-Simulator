"use client";
import { useMemo } from "react";
import type { TableRow } from "@/lib/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

interface DataTableProps {
  rows: TableRow[];
  selectedColumn?: string;
  onSelectColumn?: (key: string) => void;
}

export function DataTable({ rows, selectedColumn, onSelectColumn }: DataTableProps) {
  const { t } = useLanguage();
  const headers = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows]);
  const preview = rows.slice(0, 50);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-panel/60">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="text-sm opacity-80">{headers.length} cols · {rows.length} rows</div>
        <div className="text-xs text-gray-400">{t("livePreview")}</div>
      </div>
      <div className="overflow-auto table-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-panel sticky top-0 z-10">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className={cn(
                    "px-3 py-2 text-left font-medium cursor-pointer transition",
                    selectedColumn === header ? "bg-accent/10 text-accent" : "hover:bg-white/5"
                  )}
                  onClick={() => onSelectColumn?.(header)}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, idx) => (
              <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="even:bg-white/5/5">
                {headers.map((header) => (
                  <td
                    key={header}
                    className={cn(
                      "px-3 py-2 whitespace-nowrap border-b border-border/50",
                      selectedColumn === header ? "bg-accent/5" : ""
                    )}
                  >
                    {row[header] ?? ""}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
