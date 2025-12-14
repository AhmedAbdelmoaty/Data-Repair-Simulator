"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen flex flex-col">
      <Topbar />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-semibold mb-6">{t("appName")}</h1>
          <p className="text-gray-400 mb-8">{t("selectCaseDescription")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl border border-border bg-panel/60 shadow-soft flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm uppercase tracking-[0.1em] text-gray-400">Case 01</div>
                <div className="text-xs text-gray-500">Excel / Power Query style</div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t("caseTitle")}</h2>
                <p className="text-gray-400 text-sm">{t("caseSubtitle")}</p>
              </div>
              <Link
                href="/case/1"
                className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-semibold"
              >
                {t("startCaseCta")}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
