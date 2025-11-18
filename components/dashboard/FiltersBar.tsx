// components/dashboard/FiltersBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18nProvider";

type FiltersBarProps = {
  companyFilter: string;
  onCompanyFilterChange: (value: string) => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectedDateChange: (value: string) => void;
  sortOrder: "newest" | "oldest";
  onSortOrderChange: (value: "newest" | "oldest") => void;
  onClearFilters: () => void;
};

export function FiltersBar({
  companyFilter,
  onCompanyFilterChange,
  selectedDate,
  onSelectedDateChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: FiltersBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <Input
        value={companyFilter}
        onChange={(e) => onCompanyFilterChange(e.target.value)}
        placeholder={t("dashboard.filterPlaceholder")}
        className="w-60 rounded-full bg-white border border-slate-200 shadow-sm"
      />

      <div className="flex items-center gap-3">
        {/* filtr podle konkrétního dne */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {t("dashboard.dateLabel") ?? "Datum"}
          </span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
            className="rounded-full bg-white border border-slate-200 shadow-sm text-sm px-3 py-1 h-8"
          />
        </div>

        {/* řazení */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {t("dashboard.sortLabel") ?? "Řazení"}
          </span>
          <select
            value={sortOrder}
            onChange={(e) =>
              onSortOrderChange(e.target.value as "newest" | "oldest")
            }
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm h-8"
          >
            <option value="newest">
              {t("dashboard.sortNewest") ?? "Nejnovější první"}
            </option>
            <option value="oldest">
              {t("dashboard.sortOldest") ?? "Nejstarší první"}
            </option>
          </select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full px-3"
          onClick={onClearFilters}
        >
          {/* {t("dashboard.clearFilters") ?? "Reset"} */}
          Reset
        </Button>
      </div>
    </div>
  );
}
