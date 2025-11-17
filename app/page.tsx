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
  createdAt: string; // ISO datum z backendu
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

type ShipmentsResponse = {
  items: ShipmentFromApi[];
  total: number;
  page: number;
  pageSize: number;
};

const PAGE_SIZE = 30;

export default function DashboardPage() {
  const [companyFilter, setCompanyFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [shipments, setShipments] = useState<ShipmentFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { t, locale, setLocale } = useI18n();

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  async function loadShipments(page: number) {
    try {
      setLoading(true);
      setError(null);

      const url = new URL(`${BACKEND_URL}/api/shipments`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("pageSize", String(PAGE_SIZE));

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error("Failed to fetch shipments");
      }

      const data = (await res.json()) as ShipmentsResponse;
      setShipments(data.items);
      setTotal(data.total);
      setCurrentPage(data.page);
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se načíst zásilky.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShipments(1);
  }, []);

  // filtr: firma + konkrétní den (createdAt)
  const filteredShipments = shipments.filter((s) => {
    const matchesCompany = companyFilter
      ? s.company.name.toLowerCase().includes(companyFilter.toLowerCase())
      : true;

    const matchesDate = selectedDate
      ? new Date(s.createdAt).toISOString().slice(0, 10) === selectedDate
      : true;

    return matchesCompany && matchesDate;
  });

  // sort podle createdAt
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();

    return sortOrder === "newest" ? db - da : da - db;
  });

  const handleUploaded = () => {
    // po úspěšném uploadu načti znovu první stránku
    loadShipments(1);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

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

        {/* Filter row: firma + den + řazení */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Input
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            placeholder={t("dashboard.filterPlaceholder")}
            className="w-60 rounded-full bg-white border border-slate-200 shadow-sm"
          />

          <div className="flex items-center gap-3">
            {/* filtr podle konkrétního dne */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Datum:</span>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-full bg-white border border-slate-200 shadow-sm text-sm px-3 py-1 h-8"
              />
            </div>

            {/* řazení */}
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm h-8"
            >
              <option value="newest">Nejnovější první</option>
              <option value="oldest">Nejstarší první</option>
            </select>
          </div>
        </div>

        {/* Stav načítání / chyba */}
        {loading && (
          <div className="mb-4 text-sm text-slate-500">Načítám zásilky…</div>
        )}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        {/* Grid of shipment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedShipments.map((s) => (
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
            />
          ))}

          {!loading && !error && sortedShipments.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              {t("dashboard.noShipments")}
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {total > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <div>
              Stránka {currentPage} / {totalPages} · celkem {total} zásilek
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canGoPrev || loading}
                onClick={() => canGoPrev && loadShipments(currentPage - 1)}
              >
                Předchozí
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canGoNext || loading}
                onClick={() => canGoNext && loadShipments(currentPage + 1)}
              >
                Další
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
