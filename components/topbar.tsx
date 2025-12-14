"use client";
import { useLanguage } from "@/components/language-provider";
import { Globe, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TopbarProps {
  onReplay?: () => void;
  showReplay?: boolean;
}

export function Topbar({ onReplay, showReplay }: TopbarProps) {
  const { lang, toggle, t } = useLanguage();
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-panel/80 backdrop-blur">
      <Link href="/" className="text-lg font-semibold tracking-tight">{t("appName")}</Link>
      <div className="flex items-center gap-3">
        {showReplay && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReplay}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel border border-border text-sm"
          >
            <RotateCcw size={16} />
            <span>{t("replay")}</span>
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel border border-border text-sm"
        >
          <Globe size={16} />
          <span>{t("language")}</span>
          <span className="text-xs opacity-70">{lang.toUpperCase()}</span>
        </motion.button>
      </div>
    </div>
  );
}
