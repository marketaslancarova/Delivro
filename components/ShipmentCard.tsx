"use client";

import { useI18n } from "@/i18n/i18nProvider";
import { Clock3 } from "lucide-react";

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
  onShowHistory?: () => void; // callback pro otevření historie
  hasHistory?: boolean; // jestli pro zásilku existuje aspoň jedna faktura
};

export function ShipmentCard(props: ShipmentCardProps) {
  const {
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
  } = props;

  const { t } = useI18n();
  const isExport = mode === "EXPORT";

  // Format "2025-11-17T08:05:00.000Z" → "17. 11. 2025"
  const formattedDate = new Date(createdAt).toLocaleDateString("cs-CZ");

  return (
    <div
      className="
        relative
        flex items-stretch gap-4
        rounded-2xl
        border border-slate-200
        bg-white
        px-4 py-3
        shadow-sm
        hover:border-[#00C3A0]
        hover:shadow-md
        transition-all
        overflow-hidden
        min-h-[115px]
      "
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
        {/* DATE FROM SHIPMENT CREATEDAT */}
        <div className="text-xs text-slate-500">{formattedDate}</div>

        <div className="flex items-center gap-2 mt-2">
          <span
            className={`
              inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold
              ${
                isExport
                  ? "bg-[#D9F7EF] text-[#00997F]"
                  : "bg-[#1F2937] text-white"
              }
            `}
          >
            {isExport ? t("dashboard.export") : t("dashboard.import")}
          </span>

          {/* MALÁ IKONKA HISTORIE – jen pokud existuje historie + je callback */}
          {onShowHistory && hasHistory && (
            <button
              type="button"
              onClick={onShowHistory}
              className="inline-flex items-center justify-center rounded-full p-1.5 border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Zobrazit historii faktur"
            >
              <Clock3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
