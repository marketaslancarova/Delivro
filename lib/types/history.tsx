// lib/history.ts
import { BACKEND_URL } from "@/lib/config";

export type InvoiceHistoryItem = {
  id: string;
  price: number | string;
  weight: string;
  uploadedAt: string;
};

export type ShipmentSummary = {
  id: string;
  trackingNumber: string;
  companyName: string;
};

export type ShipmentHistoryResponse = {
  shipment: {
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
  };
  history: InvoiceHistoryItem[];
};

export async function fetchShipmentHistory(
  shipmentId: string
): Promise<ShipmentHistoryResponse> {
  const res = await fetch(`${BACKEND_URL}/api/shipments/${shipmentId}/history`);
  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }
  return res.json();
}
