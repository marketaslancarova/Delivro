"use client";

import { useI18n } from "@/i18n/i18nProvider";

type ShipmentCardProps = {
  trackingNumber: string;
  companyName: string;
  provider: string;
  price: number;
  currency: string;
  date: string;
  originCountry: string;
  destinationCountry: string;
  mode: "EXPORT" | "IMPORT";
  invoiceCount?: number;
};

export function ShipmentCard(props: ShipmentCardProps) {
  const {
    trackingNumber,
    companyName,
    provider,
    price,
    currency,
    date,
    originCountry,
    destinationCountry,
    mode,
    invoiceCount,
  } = props;

  const { t } = useI18n();
  const isExport = mode === "EXPORT";

  return (
    <div className="flex items-stretch gap-4 rounded-2xl bg-white px-4 py-3 border border-slate-200 shadow-sm hover:border-[#00C3A0] hover:shadow-md transition-all">
      {/* Provider "logo" */}
      <div className="flex items-center">
        <div className="text-2xl font-extrabold text-slate-900">{provider}</div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">
            TRK#
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {trackingNumber}
          </div>
          <div className="text-xs text-slate-500 truncate max-w-[210px]">
            {companyName}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#00997F]">
              {price.toFixed(2)} {currency}
            </span>
            {invoiceCount && invoiceCount > 1 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {t("dashboard.invoiceCount")}: {invoiceCount}
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5">
              {originCountry}
            </span>
            <span className="text-slate-400">→</span>
            <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5">
              {destinationCountry}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end text-right">
        <div className="text-xs text-slate-500">{date}</div>
        <span
          className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
            isExport ? "bg-[#D9F7EF] text-[#00997F]" : "bg-[#1F2937] text-white"
          }`}
        >
          {isExport ? t("dashboard.export") : t("dashboard.import")}
        </span>
      </div>
    </div>
  );
}
