"use client";

import { useState, useEffect } from "react";
import { ShipmentCard } from "../components/ShipmentCard";
import { UploadInvoicesDialog } from "@/components/UploadInvoicesDialog";
import { useI18n } from "@/i18n/i18nProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type ShipmentFromApi = {
  id: string;
  trackingNumber: string;
  provider: string;
  mode: "EXPORT" | "IMPORT";
  originCountry: string;
  destinationCountry: string;
  company: {
    id: string;
    name: string;
  };
  latestInvoice: null | {
    price: number;
    weight: string;
    uploadedAt: string;
  };
};

export default function DashboardPage() {
  const [companyFilter, setCompanyFilter] = useState("");
  const [shipments, setShipments] = useState<ShipmentFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t, locale, setLocale } = useI18n();

  async function loadShipments() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/api/shipments`);
      if (!res.ok) {
        throw new Error("Failed to fetch shipments");
      }

      const data = (await res.json()) as ShipmentFromApi[];
      setShipments(data);
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se načíst zásilky.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = shipments.filter((s) =>
    companyFilter
      ? s.company.name.toLowerCase().includes(companyFilter.toLowerCase())
      : true
  );

  const handleUploaded = () => {
    // po úspěšném uploadu refetchnout shipmenty
    loadShipments();
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

        {/* Stav načítání / chyba */}
        {loading && (
          <div className="mb-4 text-sm text-slate-500">Načítám zásilky…</div>
        )}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        {/* Grid of shipment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredShipments.map((s) => (
            <ShipmentCard
              key={s.id}
              trackingNumber={s.trackingNumber}
              companyName={s.company.name}
              provider={s.provider}
              price={s.latestInvoice?.price ?? 0}
              currency="Kč"
              date={
                s.latestInvoice
                  ? new Date(s.latestInvoice.uploadedAt).toLocaleDateString(
                      "cs-CZ"
                    )
                  : "-"
              }
              originCountry={s.originCountry}
              destinationCountry={s.destinationCountry}
              mode={s.mode}
              // invoiceCount můžeme doplnit z history endpointu později
            />
          ))}

          {!loading && !error && filteredShipments.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              {t("dashboard.noShipments")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
