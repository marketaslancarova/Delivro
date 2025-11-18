// components/dashboard/LanguageSwitcher.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18nProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex items-center rounded-full bg-white border border-slate-200 px-1 py-1 text-xs shadow-sm">
      <Button
        type="button"
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={locale === "cs" ? "default" : "ghost"}
        size="sm"
        className="rounded-full px-3"
        onClick={() => setLocale("cs")}
      >
        CS
      </Button>
    </div>
  );
}
