// components/UploadInvoicesDialog.tsx
"use client";

import { useState, useRef } from "react";
import { useI18n } from "@/i18n/i18nProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, Trash2, Plus } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";
import {
  InvoiceRecordJson,
  PreviewRow,
  buildFileKey,
  isJsonFile,
  parseInvoiceFile,
} from "@/lib/types/invoices";
import { cn } from "@/lib/utils";

type ParsedFile = {
  id: string;
  file: File;
  rows: PreviewRow[];
  records: InvoiceRecordJson[];
  expanded: boolean;
};

type UploadInvoicesDialogProps = {
  onUploaded?: () => void;
};

export function UploadInvoicesDialog({
  onUploaded,
}: UploadInvoicesDialogProps) {
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetState = () => {
    setParsedFiles([]);
    setError(null);
    setIsUploading(false);
    setIsParsing(false);
    setIsDragging(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetState();
  };

  // zparsuje a přidá nové soubory
  const addFiles = async (filesToAdd: File[]) => {
    if (!filesToAdd.length) return;

    setIsParsing(true);
    setError(null);

    try {
      const existingKeys = new Set(parsedFiles.map((pf) => pf.id));

      const uniqueFiles = filesToAdd.filter((file) => {
        const key = buildFileKey(file);
        return !existingKeys.has(key);
      });

      const newlyParsed: ParsedFile[] = [];

      for (const file of uniqueFiles) {
        try {
          const { rows, records } = await parseInvoiceFile(file);

          newlyParsed.push({
            id: buildFileKey(file),
            file,
            rows,
            records,
            expanded: false,
          });
        } catch (err) {
          console.error(err);
          // jedna chyba = zobrazíme obecnou hlášku, aby uživatel věděl
          setError(t("uploadDialog.invalidJson"));
        }
      }

      if (newlyParsed.length) {
        setParsedFiles((prev) => [...prev, ...newlyParsed]);
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    await addFiles(Array.from(fileList));
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const jsonFiles = Array.from(e.dataTransfer.files).filter(isJsonFile);
    if (!jsonFiles.length) return;

    await addFiles(jsonFiles);
  };

  const toggleFileExpanded = (id: string) => {
    setParsedFiles((prev) =>
      prev.map((pf) => (pf.id === id ? { ...pf, expanded: !pf.expanded } : pf))
    );
  };

  const handleRemoveFile = (id: string) => {
    setParsedFiles((prev) => prev.filter((pf) => pf.id !== id));
  };

  const handleConfirmUpload = async () => {
    if (!parsedFiles.length) {
      setError(t("uploadDialog.invalidJson"));
      return;
    }

    const allRecords: InvoiceRecordJson[] = parsedFiles.flatMap(
      (pf) => pf.records
    );

    setIsUploading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/invoices/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allRecords),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      await res.json();
      setOpen(false);
      resetState();
      onUploaded?.();
    } catch (err) {
      console.error(err);
      setError(t("uploadDialog.errorUpload"));
    } finally {
      setIsUploading(false);
    }
  };

  const hasFiles = parsedFiles.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full bg-[#00C3A0] hover:bg-[#009E85] text-white"
          size="sm"
        >
          {t("dashboard.uploadInvoices")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("uploadDialog.title")}</DialogTitle>
          <DialogDescription>{t("uploadDialog.helperText")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zóna + obsah */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border border-dashed rounded-2xl bg-slate-50/50 transition px-4",
              hasFiles ? "py-4" : "py-8",
              isDragging
                ? "border-[#00C3A0] bg-emerald-50/50"
                : "border-slate-200"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            {!hasFiles ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="w-full flex flex-col items-center gap-1 text-center cursor-pointer"
              >
                <span className="text-slate-600">
                  {t("uploadDialog.dropHereText") ??
                    "Upload a JSON file to see the invoice data before confirming."}
                </span>
                <span className="text-xs text-slate-400">
                  {t("uploadDialog.dropHereSubtextPrefix") ?? "Drag & drop or "}
                  <span className="underline text-[#00997F] hover:text-[#007a64]">
                    {t("uploadDialog.dropHereSubtextClick") ??
                      "click to select one or more .json files."}
                  </span>
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {t("uploadDialog.uploadedFilesLabel") ??
                      "Uploaded files (click to preview, bin to remove):"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {t("uploadDialog.addMore") ?? "Add more"}
                  </Button>
                </div>

                {parsedFiles.map((pf) => (
                  <div
                    key={pf.id}
                    className="border border-slate-200 rounded-xl bg-white"
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      <button
                        type="button"
                        onClick={() => toggleFileExpanded(pf.id)}
                        className="flex items-center gap-2 text-left"
                      >
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            pf.expanded && "rotate-90"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-xs sm:max-w-sm">
                            {pf.file.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {pf.rows.length}{" "}
                            {t("uploadDialog.rowsLabel") ?? "records in file"}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(pf.id)}
                        className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {pf.expanded && pf.rows.length > 0 && (
                      <div className="border-t border-slate-100 max-h-56 overflow-y-auto">
                        <Table className="w-full text-sm table-fixed">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[140px]">
                                Tracking #
                              </TableHead>
                              <TableHead className="w-[220px]">
                                {t("dashboard.company")}
                              </TableHead>
                              <TableHead className="w-[100px]">
                                Provider
                              </TableHead>
                              <TableHead className="w-[120px]">Route</TableHead>
                              <TableHead className="text-right w-[90px]">
                                Price
                              </TableHead>
                              <TableHead className="text-right w-[90px]">
                                Weight
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pf.rows.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.trackingNumber}</TableCell>
                                <TableCell className="truncate">
                                  {row.companyName}
                                </TableCell>
                                <TableCell>{row.provider}</TableCell>
                                <TableCell>
                                  {row.originCountry} → {row.destinationCountry}
                                </TableCell>
                                <TableCell className="text-right text-[#00997F] font-semibold">
                                  {row.invoicedPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {row.invoicedWeight ?? "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {isParsing && (
            <Badge variant="outline">{t("uploadDialog.parsing")}</Badge>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              {t("uploadDialog.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUpload}
              disabled={isUploading || !parsedFiles.length}
              className="bg-[#00C3A0] hover:bg-[#009E85] text-white"
            >
              {isUploading
                ? t("uploadDialog.uploading")
                : t("uploadDialog.confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
