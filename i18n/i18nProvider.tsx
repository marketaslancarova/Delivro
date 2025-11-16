"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { messages } from "./messages";
import type { Locale, TranslationKey } from "./types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  function t(key: TranslationKey): string {
    const parts = key.split(".");
    let obj: unknown = messages[locale];

    for (const part of parts) {
      if (typeof obj === "object" && obj !== null && part in obj) {
        obj = (obj as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }

    return typeof obj === "string" ? obj : key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
