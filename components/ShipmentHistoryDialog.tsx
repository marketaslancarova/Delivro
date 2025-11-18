// components/ShipmentHistoryDialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchShipmentHistory,
  InvoiceHistoryItem,
  ShipmentSummary,
} from "@/lib/types/history";
import { useI18n } from "@/i18n/i18nProvider";

type ShipmentHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: ShipmentSummary | null;
};

export function ShipmentHistoryDialog({
  open,
  onOpenChange,
  shipment,
}: ShipmentHistoryDialogProps) {
  const { t } = useI18n();

  const [items, setItems] = useState<InvoiceHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !shipment) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchShipmentHistory(shipment.id);
        setItems(data.history);
      } catch (err) {
        console.error(err);
        setError("Nepodařilo se načíst historii faktur.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, shipment, t]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setItems([]);
          setError(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {"Historie faktur"}{" "}
            {shipment
              ? `– ${shipment.trackingNumber} (${shipment.companyName})`
              : ""}
          </DialogTitle>
        </DialogHeader>

        {!shipment && (
          <div className="text-sm text-slate-500">
            {"Není vybraná žádná zásilka."}
          </div>
        )}

        {shipment && (
          <>
            {loading && (
              <div className="text-sm text-slate-500">
                {"Načítám historii faktur…"}
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && items.length === 0 && (
              <div className="text-sm text-slate-500">
                {"Pro tuto zásilku zatím žádná historie faktur není."}
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="max-h-72 overflow-y-auto">
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead className="text-right">{"Cena"}</TableHead>
                      <TableHead className="text-right">{"Váha"}</TableHead>
                      <TableHead>{"Datum nahrání"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-mono text-xs">
                          {h.id}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(h.price).toFixed(2)} Kč
                        </TableCell>
                        <TableCell className="text-right">{h.weight}</TableCell>
                        <TableCell>
                          {new Date(h.uploadedAt).toLocaleString("cs-CZ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
