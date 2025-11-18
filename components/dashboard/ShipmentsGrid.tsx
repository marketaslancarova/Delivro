// components/dashboard/ShipmentsGrid.tsx
"use client";

import { ShipmentFromApi } from "@/lib/types/data.types";
import { ShipmentCard } from "@/components/ShipmentCard";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18nProvider";

type HistoryShipment = {
  id: string;
  trackingNumber: string;
  companyName: string;
};

type ShipmentsGridProps = {
  shipments: ShipmentFromApi[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onShowHistory: (shipment: HistoryShipment) => void;
};

export function ShipmentsGrid({
  shipments,
  isLoading,
  error,
  onRetry,
  onShowHistory,
}: ShipmentsGridProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="mb-4 text-sm text-slate-500">
        {t("dashboard.loading") ?? "Načítám zásilky…"}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm">
        <span className="text-red-700">{error}</span>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          znovu
        </Button>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="col-span-full rounded-2xl bg-white border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
        {t("dashboard.noShipments")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {shipments.map((s) => (
        <ShipmentCard
          key={s.id}
          trackingNumber={s.trackingNumber}
          companyName={s.company.name}
          provider={s.provider}
          price={s.latestInvoice?.price ?? 0}
          currency="Kč"
          createdAt={s.createdAt}
          originCountry={s.originCountry}
          destinationCountry={s.destinationCountry}
          mode={s.mode}
          hasHistory={!!s.latestInvoice}
          onShowHistory={() =>
            onShowHistory({
              id: s.id,
              trackingNumber: s.trackingNumber,
              companyName: s.company.name,
            })
          }
        />
      ))}
    </div>
  );
}
