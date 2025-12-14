"use client";
import type { Step } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface StepsTimelineProps {
  steps: Step[];
  onDelete: (id: string) => void;
  onUndo: () => void;
}

export function StepsTimeline({ steps, onDelete, onUndo }: StepsTimelineProps) {
  const { t } = useLanguage();
  return (
    <div className="border border-border rounded-2xl bg-panel/70 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t("appliedSteps")}</h3>
        <button
          onClick={onUndo}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-border hover:border-accent"
        >
          <RotateCcw size={16} /> {t("undo")}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {steps.length === 0 && <div className="text-sm text-gray-400">{t("noSteps")}</div>}
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/70 bg-black/10"
          >
            <div>
              <div className="text-sm font-medium">{step.label}</div>
              <div className="text-xs text-gray-400">{step.column}</div>
            </div>
            <button onClick={() => onDelete(step.id)} className="text-gray-400 hover:text-red-400">
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
