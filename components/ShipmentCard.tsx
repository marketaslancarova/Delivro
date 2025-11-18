// components/ShipmentCard.tsx
"use client";

import { useI18n } from "@/i18n/i18nProvider";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ShipmentCardProps = {
  trackingNumber: string;
  companyName: string;
  provider: string;
  price: number;
  currency: string;
  createdAt: string;
  originCountry: string;
  destinationCountry: string;
  mode: "EXPORT" | "IMPORT";
  invoiceCount?: number;
  onShowHistory?: () => void;
  hasHistory?: boolean;
};

function formatShipmentDate(createdAt: string, locale: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  const intlLocale = locale === "cs" ? "cs-CZ" : "en-GB";
  return date.toLocaleDateString(intlLocale);
}

export function ShipmentCard({
  trackingNumber,
  companyName,
  provider,
  price,
  currency,
  createdAt,
  originCountry,
  destinationCountry,
  mode,
  invoiceCount,
  onShowHistory,
  hasHistory,
}: ShipmentCardProps) {
  const { t, locale } = useI18n();
  const isExport = mode === "EXPORT";

  const formattedDate = formatShipmentDate(createdAt, locale);

  return (
    <div
      className={cn(
        "relative flex items-stretch gap-4 rounded-2xl border border-slate-200",
        "bg-white px-4 py-3 shadow-sm transition-all overflow-hidden min-h-[115px]",
        "hover:border-[#00C3A0] hover:shadow-md"
      )}
    >
      {/* Left column - Provider */}
      <div className="flex items-center pr-2">
        <div className="text-2xl font-extrabold text-slate-900 whitespace-nowrap">
          {provider}
        </div>
      </div>

      {/* Middle column */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">
            TRK#
          </div>

          <div className="text-sm font-semibold text-slate-900 break-all">
            {trackingNumber}
          </div>

          <div className="text-xs text-slate-500 truncate max-w-full">
            {companyName}
          </div>
        </div>

        <div>
          {/* Price + invoice count */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#00997F] whitespace-nowrap">
              {price.toFixed(2)} {currency}
            </span>

            {typeof invoiceCount === "number" && invoiceCount > 1 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 whitespace-nowrap">
                {t("dashboard.invoiceCount")}: {invoiceCount}
              </span>
            )}
          </div>

          {/* Route */}
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 whitespace-nowrap">
              {originCountry}
            </span>
            <span className="text-slate-400">→</span>
            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 whitespace-nowrap">
              {destinationCountry}
            </span>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col justify-between items-end text-right whitespace-nowrap">
        <div className="text-xs text-slate-500">{formattedDate}</div>

        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold",
              isExport
                ? "bg-[#D9F7EF] text-[#00997F]"
                : "bg-[#1F2937] text-white"
            )}
          >
            {isExport ? t("dashboard.export") : t("dashboard.import")}
          </span>

          {onShowHistory && hasHistory && (
            <button
              type="button"
              onClick={onShowHistory}
              className="inline-flex items-center justify-center rounded-full p-1.5 border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label={"Zobrazit historii faktur"}
            >
              <Clock3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
