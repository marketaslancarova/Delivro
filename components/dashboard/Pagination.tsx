// components/dashboard/Pagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18nProvider";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  isLoading,
  onPageChange,
}: PaginationProps) {
  const { t } = useI18n();

  if (totalItems === 0) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
      <div>
        Stránka {currentPage} / {totalPages} · {"celkem"} {totalItems}{" "}
        {"zásilek"}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev || isLoading}
          onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        >
          {t("dashboard.prevPage") ?? "Předchozí"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext || isLoading}
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
        >
          {t("dashboard.nextPage") ?? "Další"}
        </Button>
      </div>
    </div>
  );
}
