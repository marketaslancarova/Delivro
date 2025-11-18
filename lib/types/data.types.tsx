// lib/types/shipments.ts

export type ShipmentMode = "EXPORT" | "IMPORT";

export type ShipmentFromApi = {
  id: string;
  trackingNumber: string;
  provider: string;
  mode: ShipmentMode;
  originCountry: string;
  destinationCountry: string;
  createdAt: string; // ISO string
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

export type ShipmentsResponse = {
  items: ShipmentFromApi[];
  total: number;
  page: number;
  pageSize: number;
};
