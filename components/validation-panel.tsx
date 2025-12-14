"use client";
import { ValidationResult } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface ValidationPanelProps {
  results: ValidationResult[];
  onRun: () => void;
  grade?: string | null;
}

export function ValidationPanel({ results, onRun, grade }: ValidationPanelProps) {
  const { t } = useLanguage();
  const allPassed = results.length > 0 && results.every((r) => r.passed);
  return (
    <div className="border border-border rounded-2xl bg-panel/80 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{t("objectives")}</h3>
          <p className="text-xs text-gray-400">{t("objectivesHint")}</p>
        </div>
        <button
          onClick={onRun}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-semibold"
        >
          {t("runValidation")}
        </button>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {results.map((res) => (
            <motion.div
              key={res.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2 px-3 py-2 rounded-lg border border-border/80"
            >
              {res.passed ? (
                <CheckCircle2 className="text-emerald-400" size={18} />
              ) : (
                <XCircle className="text-red-400" size={18} />
              )}
              <div className="text-sm">
                <div className="font-medium">{res.title}</div>
                {!res.passed && <div className="text-xs text-gray-400">{res.hint}</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {allPassed && grade && (
        <div className="p-3 rounded-lg border border-emerald-400/40 bg-emerald-500/10">
          <div className="text-sm font-semibold text-emerald-200">{t("allChecksPassed")}</div>
          <div className="text-xs text-emerald-100">{t("grade")}: {grade}</div>
        </div>
      )}
    </div>
  );
}
