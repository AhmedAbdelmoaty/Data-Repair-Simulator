"use client";
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { Topbar } from "@/components/topbar";
import { Toolbox } from "@/components/toolbox";
import { DataTable } from "@/components/data-table";
import { StepsTimeline } from "@/components/steps-timeline";
import { ValidationPanel } from "@/components/validation-panel";
import type { Step, TableRow, ToolType } from "@/lib/types";
import { applyStep, reapplySteps } from "@/lib/transformations";
import { runValidation, computeGrade } from "@/lib/validation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function CaseOnePage() {
  const { dir, t } = useLanguage();
  const toolLabel: Record<ToolType, string> = {
    trim: t("trimClean"),
    replace: t("replaceValues"),
    changeType: t("changeType"),
    removeDuplicates: t("removeDuplicates"),
    handleNulls: t("handleNulls"),
    split: t("splitColumn"),
  };
  const [originalRows, setOriginalRows] = useState<TableRow[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [steps, setSteps] = useState<Step[]>([]);
  const [validation, setValidation] = useState(runValidation([]));
  const [grade, setGrade] = useState<string | null>(null);

  useEffect(() => {
    fetch("/datasets/sales_messy.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse<TableRow>(text, { header: true, skipEmptyLines: true });
        setOriginalRows(parsed.data);
        setRows(parsed.data);
      });
  }, []);

  const handleApply = (tool: ToolType, params: Record<string, any>) => {
    if (!selectedColumn && tool !== "removeDuplicates") return;
    const step: Step = {
      id: `${Date.now()}-${tool}`,
      tool,
      column: selectedColumn,
      params,
      label: `${toolLabel[tool]} · ${selectedColumn ?? "table"}`
    };
    const nextSteps = [...steps, step];
    const updated = applyStep(step, rows);
    setSteps(nextSteps);
    setRows(updated);
  };

  const handleUndo = () => {
    if (steps.length === 0) return;
    const nextSteps = steps.slice(0, -1);
    const recomputed = reapplySteps(originalRows, nextSteps);
    setSteps(nextSteps);
    setRows(recomputed);
  };

  const handleDelete = (id: string) => {
    const remaining = steps.filter((s) => s.id !== id);
    setSteps(remaining);
    setRows(reapplySteps(originalRows, remaining));
  };

  const runChecks = () => {
    const results = runValidation(rows);
    setValidation(results);
    if (results.every((r) => r.passed)) {
      setGrade(computeGrade(steps.length));
    } else {
      setGrade(null);
    }
  };

  const replay = () => {
    setSteps([]);
    setRows(originalRows);
    setValidation(runValidation(originalRows));
    setGrade(null);
  };

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <Topbar onReplay={replay} showReplay />
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[280px_1fr_320px] gap-4 p-6">
        <section className="space-y-3">
          <div className="p-4 rounded-2xl border border-border bg-panel/80">
            <div className="text-sm text-gray-400 mb-2">{t("selectedColumn")}</div>
            <div className="font-semibold">{selectedColumn ?? "--"}</div>
          </div>
          <Toolbox onApply={handleApply} selectedColumn={selectedColumn} />
        </section>
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t("dataPreview")}</h2>
              <p className="text-gray-400 text-sm">{t("dataPreviewHint")}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Sparkles size={16} /> {t("live")}
            </div>
          </div>
          <DataTable rows={rows} selectedColumn={selectedColumn} onSelectColumn={setSelectedColumn} />
        </section>
        <section className="space-y-3">
          <ValidationPanel results={validation} onRun={runChecks} grade={grade} />
          {grade && (
            <div className="p-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10">
              <div className="text-sm text-emerald-200 font-semibold">{t("score")}</div>
              <div className="text-2xl font-bold text-emerald-100">{grade}</div>
            </div>
          )}
        </section>
      </div>
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <StepsTimeline steps={steps} onDelete={handleDelete} onUndo={handleUndo} />
        </motion.div>
      </div>
    </div>
  );
}
