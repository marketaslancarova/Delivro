export const messages = {
  en: {
    dashboard: {
      filterPlaceholder: "Filter by company…",
      noShipments:
        "No shipments match the selected filter. Try adjusting the filter or upload new invoices.",

      export: "EXPORT",
      import: "IMPORT",
      invoiceCount: "invoices",
      company: "Company",
      uploadInvoices: "Upload Invoices",
    },

    uploadDialog: {
      title: "Preview invoice data",
      helperText:
        "Upload a JSON file to see the invoice data before confirming.",

      // drop zone
      dropHereText:
        "Upload a JSON file to see the invoice data before confirming.",
      dropHereSubtext:
        "Drag & drop or click to select one or more .json files.",
      dropHereSubtextPrefix: "Drag & drop or",
      dropHereSubtextClick: "click to select one or more .json files.",

      // file list
      uploadedFilesLabel: "Uploaded files",
      rowsLabel: "records",
      addMore: "Add more",

      // toggling
      showDetails: "Show details",
      hideDetails: "Hide details",

      pickFilePlaceholder: "Pick JSON file…",
      changeFile: "Change file",
      cancel: "Cancel",
      confirm: "Confirm",
      uploading: "Uploading…",
      parsing: "Reading and parsing JSON…",
      invalidJson: "The file does not contain a valid invoice JSON array.",
      errorUpload: "Something went wrong during upload.",
    },
  },

  cs: {
    dashboard: {
      filterPlaceholder: "Filtrovat podle firmy…",
      noShipments:
        "Žádné zásilky neodpovídají filtru. Změň filtr nebo nahraj nové faktury.",

      export: "EXPORT",
      import: "IMPORT",
      invoiceCount: "faktur",
      company: "Firma",
      uploadInvoices: "Nahrát faktury",
    },

    uploadDialog: {
      title: "Náhled fakturačních dat",
      helperText: "Nahraj JSON soubor a zobrazí se náhled dat před potvrzením.",

      // drop zóna
      dropHereText: "Nahraj JSON soubor nebo jej přetáhni do tohoto pole.",
      dropHereSubtext: "Podporováno je nahrání jednoho či více .json souborů.",
      dropHereSubtextPrefix: "Přetáhni sem soubor nebo",
      dropHereSubtextClick: "kliknutím vyber jeden či více .json souborů.",

      // seznam souborů
      uploadedFilesLabel: "Nahrané soubory",
      rowsLabel: "záznamů",
      addMore: "Přidat další",

      // toggling
      showDetails: "Zobrazit detaily",
      hideDetails: "Skrýt detaily",

      pickFilePlaceholder: "Vyber JSON soubor…",
      changeFile: "Změnit soubor",
      cancel: "Zrušit",
      confirm: "Potvrdit",
      uploading: "Nahrávám…",
      parsing: "Načítám a parsuji JSON…",
      invalidJson: "Soubor neobsahuje validní JSON pole s fakturami.",
      errorUpload: "Něco se pokazilo při nahrávání.",
    },
  },
} as const;
