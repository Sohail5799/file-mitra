export type FaqItem = { question: string; answer: string };

/** Used on the blog index for readers + FAQPage JSON-LD. */
export const BLOG_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is File Mitra free to use?",
    answer:
      "Yes. The tools on File Mitra are free to use for typical personal and small-business workflows. You upload a file, we process it, and you download the result. We do not charge per conversion for the flows shown in the app."
  },
  {
    question: "Do my files stay on your servers?",
    answer:
      "Files are processed to complete your task (convert, compress, merge, OCR, etc.) and are not kept for long-term storage as part of the product experience. Always read the Privacy Policy for the full picture, and avoid uploading highly sensitive documents if your policy does not allow it."
  },
  {
    question: "Which image formats can I convert between?",
    answer:
      "You can convert between common raster formats such as JPEG, PNG, WebP, and BMP. Pick the output that fits your use case: JPEG for photos, PNG for transparency, WebP for smaller web assets when supported."
  },
  {
    question: "Why does my PDF to Excel export look different from the original?",
    answer:
      "PDFs do not always store a real spreadsheet structure. When tables are drawn as graphics or text is reflowed, extraction is harder. For bank-style tables, try a tables-first mode; for narrative documents, a text-oriented workflow into Word may be easier to edit."
  },
  {
    question: "What helps OCR work better on scans?",
    answer:
      "Higher contrast, straighter pages, and enough resolution (but not huge unnecessary megapixels) usually help. Cropping to the text region, avoiding heavy shadows, and choosing the correct language in OCR settings also improve accuracy on real-world scans."
  },
  {
    question: "Can I merge PDFs in a custom order?",
    answer:
      "Yes. Add your PDFs, reorder them in the list, then merge. The output follows the order you set, which matters for contracts, reports, and appendices."
  },
  {
    question: "Will compression always make my PDF smaller?",
    answer:
      "Usually, but not always. Already-compressed PDFs or files that are mostly vector text may see modest gains. Scanned PDFs often shrink more when images inside the file are re-encoded at a sensible quality level."
  },
  {
    question: "Do I need to install software?",
    answer:
      "No install is required for the web app. Use a modern browser, keep the tab open until the download finishes, and ensure a stable connection for large files or long OCR jobs."
  }
];
