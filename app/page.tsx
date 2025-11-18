// app/page.tsx
"use client";

import { useState, useEffect } from "react";

import { ShipmentHistoryDialog } from "@/components/ShipmentHistoryDialog";
import { UploadInvoicesDialog } from "@/components/UploadInvoicesDialog";

import { LanguageSwitcher } from "@/components/dashboard/LanguageSwitcher";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { ShipmentsGrid } from "@/components/dashboard/ShipmentsGrid";
import { Pagination } from "@/components/dashboard/Pagination";

import { ShipmentFromApi, ShipmentsResponse } from "@/lib/data.types";
import { useI18n } from "@/i18n/i18nProvider";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

const PAGE_SIZE = 30;

type HistoryShipment = {
  id: string;
  trackingNumber: string;
  companyName: string;
};

export default function DashboardPage() {
  const { t } = useI18n();

  const [companyFilter, setCompanyFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [shipments, setShipments] = useState<ShipmentFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyShipment, setHistoryShipment] =
    useState<HistoryShipment | null>(null);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  async function loadShipments(page: number) {
    try {
      setLoading(true);
      setError(null);

      const url = new URL(`${BACKEND_URL}/api/shipments`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("pageSize", String(PAGE_SIZE));

      if (companyFilter.trim()) {
        url.searchParams.set("companyName", companyFilter.trim());
      }

      if (selectedDate) {
        url.searchParams.set("date", selectedDate);
      }

      url.searchParams.set("sort", sortOrder);

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
      setError(t("dashboard.loadError") ?? "Nepodařilo se načíst zásilky.");
    } finally {
      setLoading(false);
    }
  }

  // inicialní načtení
  useEffect(() => {
    loadShipments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // kdykoli se změní filtry, načteme znovu stránku 1
  useEffect(() => {
    loadShipments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyFilter, selectedDate, sortOrder]);

  const handleUploaded = () => {
    // po úspěšném uploadu načti znovu první stránku s aktuálními filtry
    loadShipments(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Delivro – Shipments &amp; Invoices
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Přehled všech zásilek a faktur od dopravců na jednom místě.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UploadInvoicesDialog onUploaded={handleUploaded} />
          </div>
        </header>

        {/* Filters */}
        <FiltersBar
          companyFilter={companyFilter}
          onCompanyFilterChange={setCompanyFilter}
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onClearFilters={() => {
            setCompanyFilter("");
            setSelectedDate("");
            setSortOrder("newest");
          }}
        />

        {/* Shipments grid (včetně loading/error/empty) */}
        <ShipmentsGrid
          shipments={shipments}
          isLoading={loading}
          error={error}
          onRetry={() => loadShipments(currentPage)}
          onShowHistory={(shipment) => {
            setHistoryShipment(shipment);
            setHistoryOpen(true);
          }}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          isLoading={loading}
          onPageChange={(page) => loadShipments(page)}
        />

        {/* Dialog pro historii faktur */}
        <ShipmentHistoryDialog
          open={historyOpen}
          onOpenChange={(open) => {
            setHistoryOpen(open);
            if (!open) {
              setHistoryShipment(null);
            }
          }}
          shipment={historyShipment}
        />
      </div>
    </main>
  );
}
