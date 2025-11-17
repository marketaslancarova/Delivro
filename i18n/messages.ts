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

      // NEW – filters
      dateLabel: "Date",
      sortLabel: "Sort",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",

      // OPTIONAL – stavové texty (když chceš přetáhnout i to z češtiny)
      loading: "Loading shipments…",
      loadError: "Failed to load shipments.",
      prevPage: "Previous",
      nextPage: "Next",
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

      // lehce zobecněno, ať sedí i na případ, kdy akceptuješ 1 objekt nebo pole
      invalidJson: "The file does not contain valid invoice JSON.",
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

      // NEW – filtry
      dateLabel: "Datum",
      sortLabel: "Řazení",
      sortNewest: "Nejnovější první",
      sortOldest: "Nejstarší první",

      // OPTIONAL – stavové texty pro dashboard
      loading: "Načítám zásilky…",
      loadError: "Nepodařilo se načíst zásilky.",
      prevPage: "Předchozí",
      nextPage: "Další",
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

      // taky lehce zobecněno
      invalidJson: "Soubor neobsahuje validní JSON s fakturami.",
      errorUpload: "Něco se pokazilo při nahrávání.",
    },
  },
} as const;
