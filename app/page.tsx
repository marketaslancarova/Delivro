"use client";

import { useState } from "react";
import { ShipmentCard } from "../components/ShipmentCard";
import { UploadInvoicesDialog } from "@/components/UploadInvoicesDialog";
import { useI18n } from "@/i18n/i18nProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ShipmentMock = {
  id: string;
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

const MOCK_SHIPMENTS: ShipmentMock[] = [
  {
    id: "1",
    trackingNumber: "885335999184",
    companyName: "Acme Corporation s.r.o.",
    provider: "FedEx",
    price: 457.24,
    currency: "Kč",
    date: "9. 10. 2025",
    originCountry: "CZ",
    destinationCountry: "UK",
    mode: "EXPORT",
    invoiceCount: 1,
  },
  {
    id: "2",
    trackingNumber: "885335999185",
    companyName: "Acme Corporation s.r.o.",
    provider: "FedEx",
    price: 457.24,
    currency: "Kč",
    date: "9. 10. 2025",
    originCountry: "UK",
    destinationCountry: "CZ",
    mode: "IMPORT",
    invoiceCount: 2,
  },
  {
    id: "3",
    trackingNumber: "885335999186",
    companyName: "Beta Logistics a.s.",
    provider: "GLS",
    price: 812,
    currency: "Kč",
    date: "10. 10. 2025",
    originCountry: "CZ",
    destinationCountry: "DE",
    mode: "EXPORT",
    invoiceCount: 3,
  },
];

export default function DashboardPage() {
  const [companyFilter, setCompanyFilter] = useState("");
  const { t, locale, setLocale } = useI18n();

  const filteredShipments = MOCK_SHIPMENTS.filter((s) =>
    companyFilter
      ? s.companyName.toLowerCase().includes(companyFilter.toLowerCase())
      : true
  );

  const handleUploaded = () => {
    console.log("Invoices uploaded – refetch shipments here.");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Delivro – Shipments & Invoices
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Přehled všech zásilek a faktur od dopravců na jednom místě.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
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

            <UploadInvoicesDialog onUploaded={handleUploaded} />
          </div>
        </header>

        {/* Filter row */}
        <div className="flex items-center justify-between mb-4">
          <Input
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            placeholder={t("dashboard.filterPlaceholder")}
            className="w-60 rounded-full bg-white border border-slate-200 shadow-sm"
          />
        </div>

        {/* Grid of shipment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredShipments.map((s) => (
            <ShipmentCard key={s.id} {...s} />
          ))}

          {filteredShipments.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              {t("dashboard.noShipments")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
