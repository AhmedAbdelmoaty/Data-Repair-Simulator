"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Scissors, Type, CopyX, Eraser, SplitSquareHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolType } from "@/lib/types";
import { useLanguage } from "@/components/language-provider";

interface ToolboxProps {
  onApply: (tool: ToolType, params: Record<string, any>) => void;
  selectedColumn?: string;
}

const tools: { id: ToolType; labelKey: string; icon: any; description: string }[] = [
  { id: "trim", labelKey: "trimClean", icon: Wrench, description: "Trim spaces and casing" },
  { id: "replace", labelKey: "replaceValues", icon: Eraser, description: "Find & replace values" },
  { id: "changeType", labelKey: "changeType", icon: Type, description: "Convert text/number/date" },
  { id: "removeDuplicates", labelKey: "removeDuplicates", icon: CopyX, description: "Drop duplicates" },
  { id: "handleNulls", labelKey: "handleNulls", icon: Scissors, description: "Remove or fill nulls" },
  { id: "split", labelKey: "splitColumn", icon: SplitSquareHorizontal, description: "Split by delimiter" }
];

export function Toolbox({ onApply, selectedColumn }: ToolboxProps) {
  const { t } = useLanguage();
  const [active, setActive] = useState<ToolType | null>(null);
  const [params, setParams] = useState<Record<string, any>>({});

  const handleOpen = (tool: ToolType) => {
    setActive((prev) => (prev === tool ? null : tool));
    setParams({});
  };

  const handleApply = (tool: ToolType) => {
    onApply(tool, params);
    setActive(null);
  };

  return (
    <div className="space-y-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const open = active === tool.id;
        return (
          <div key={tool.id} className="relative">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleOpen(tool.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border border-border bg-panel/80 flex items-center gap-3",
                open && "border-accent/60"
              )}
            >
              <Icon size={18} />
              <div>
                <div className="font-semibold text-sm">{t(tool.labelKey)}</div>
                <div className="text-xs text-gray-400">{tool.description}</div>
              </div>
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-full top-0 ml-3 w-72 p-4 rounded-xl border border-border bg-panel shadow-soft z-10"
                >
                  <div className="text-sm font-semibold mb-2">{t("settings")}</div>
                  {tool.id === "trim" && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-300">Mode</label>
                      <select
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.mode ?? ""}
                        onChange={(e) => setParams({ ...params, mode: e.target.value })}
                      >
                        <option value="">Default</option>
                        <option value="lower">lowercase</option>
                        <option value="upper">UPPERCASE</option>
                        <option value="title">Title Case</option>
                      </select>
                    </div>
                  )}
                  {tool.id === "replace" && (
                    <div className="space-y-2">
                      <input
                        placeholder="Find"
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.from ?? ""}
                        onChange={(e) => setParams({ ...params, from: e.target.value })}
                      />
                      <input
                        placeholder="Replace with"
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.to ?? ""}
                        onChange={(e) => setParams({ ...params, to: e.target.value })}
                      />
                    </div>
                  )}
                  {tool.id === "changeType" && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-300">Target type</label>
                      <select
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.type ?? "text"}
                        onChange={(e) => setParams({ ...params, type: e.target.value })}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                  )}
                  {tool.id === "removeDuplicates" && (
                    <div className="text-xs text-gray-400">Removes duplicate rows based on the selected column.</div>
                  )}
                  {tool.id === "handleNulls" && (
                    <div className="space-y-2">
                      <label className="text-xs text-gray-300">Strategy</label>
                      <select
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.mode ?? "remove"}
                        onChange={(e) => setParams({ ...params, mode: e.target.value })}
                      >
                        <option value="remove">Remove rows</option>
                        <option value="fill">Fill with value</option>
                      </select>
                      {params.mode === "fill" && (
                        <input
                          placeholder="Value"
                          className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                          value={params.fill ?? ""}
                          onChange={(e) => setParams({ ...params, fill: e.target.value })}
                        />
                      )}
                    </div>
                  )}
                  {tool.id === "split" && (
                    <div className="space-y-2">
                      <input
                        placeholder="Delimiter"
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.delimiter ?? ","}
                        onChange={(e) => setParams({ ...params, delimiter: e.target.value })}
                      />
                      <input
                        placeholder="Left column"
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.left ?? "First"}
                        onChange={(e) => setParams({ ...params, left: e.target.value })}
                      />
                      <input
                        placeholder="Right column"
                        className="w-full bg-surface border border-border rounded-lg px-2 py-2 text-sm"
                        value={params.right ?? "Second"}
                        onChange={(e) => setParams({ ...params, right: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setActive(null)}
                      className="px-3 py-2 text-sm rounded-lg border border-border"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={() => handleApply(tool.id)}
                      disabled={!selectedColumn && tool.id !== "removeDuplicates"}
                      className="px-3 py-2 text-sm rounded-lg bg-accent text-black font-semibold disabled:opacity-50"
                    >
                      {t("apply")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
