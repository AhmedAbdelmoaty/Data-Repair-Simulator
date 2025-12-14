"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    dir,
    t: (key: string) => translations[lang][key] ?? key,
    toggle: () => setLang((prev) => (prev === "ar" ? "en" : "ar")),
  }), [lang, dir]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("LanguageProvider missing");
  return ctx;
}
