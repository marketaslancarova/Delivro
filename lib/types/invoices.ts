// lib/invoices.ts

// Jeden záznam faktury tak, jak chodí v JSONu
export type InvoiceRecordJson = {
  id: string;
  shipment: {
    id: string;
    createdAt: string;
    trackingNumber: string;
    company: {
      id: string;
      name: string;
    };
    provider: "GLS" | "DPD" | "UPS" | "PPL" | "FedEx";
    mode: "IMPORT" | "EXPORT";
    originCountry: string;
    destinationCountry: string;
  };
  invoicedPrice: number;
  invoicedWeight: number;
};

// Řádek pro náhled v tabulce
export type PreviewRow = {
  id: string;
  trackingNumber: string;
  companyName: string;
  provider: string;
  originCountry: string;
  destinationCountry: string;
  invoicedPrice: number;
  invoicedWeight: number | null;
};

export function buildFileKey(file: File) {
  return `${file.name}-${file.lastModified}-${file.size}`;
}

export function isJsonFile(file: File) {
  return (
    file.type === "application/json" ||
    file.name.toLowerCase().endsWith(".json")
  );
}

// čistý parser jednoho souboru – neřeší UI, jen data
export async function parseInvoiceFile(file: File): Promise<{
  rows: PreviewRow[];
  records: InvoiceRecordJson[];
}> {
  const text = await file.text();
  const parsed = JSON.parse(text);

  const records: InvoiceRecordJson[] = Array.isArray(parsed)
    ? (parsed as InvoiceRecordJson[])
    : [parsed as InvoiceRecordJson];

  const rows: PreviewRow[] = records.map((raw, index) => {
    const { shipment } = raw;
    const company = shipment.company;

    return {
      id: raw.id ?? `file-${file.name}-row-${index}`,
      trackingNumber: shipment.trackingNumber ?? "N/A",
      companyName: company.name ?? "Unknown",
      provider: shipment.provider ?? "N/A",
      originCountry: shipment.originCountry ?? "-",
      destinationCountry: shipment.destinationCountry ?? "-",
      invoicedPrice: Number(raw.invoicedPrice ?? 0),
      invoicedWeight:
        raw.invoicedWeight !== undefined ? Number(raw.invoicedWeight) : null,
    };
  });

  return { rows, records };
}
