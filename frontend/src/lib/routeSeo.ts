import { SITE_NAME, SITE_ORIGIN } from "./site";

export type RouteSeo = {
  title: string;
  description: string;
  keywords: string;
};

const ROUTES: Record<string, RouteSeo> = {
  "/": {
    title: `${SITE_NAME} — Free online image & PDF tools (convert, compress, merge, OCR)`,
    description:
      "Convert images to JPEG/PNG/WebP, compress photos and PDFs, merge PDFs, turn PDFs into Word or Excel, and extract text with OCR — fast, private, browser-based workflows.",
    keywords:
      "File Mitra, free PDF tools, image to JPEG online, compress PDF, merge PDF, PDF to Word, PDF to Excel, OCR online, image compressor, convert PNG to JPG"
  },
  "/image-tools": {
    title: `Image tools — convert & compress online | ${SITE_NAME}`,
    description:
      "Convert images between JPEG, PNG, WebP and BMP, or shrink file size with quality controls — all in one image toolkit.",
    keywords: "convert image online, JPEG to PNG, PNG to WebP, compress image free, image converter browser"
  },
  "/pdf-tools": {
    title: `PDF tools — convert, compress & merge | ${SITE_NAME}`,
    description:
      "PDF to Word or Excel, compress PDFs, merge multiple PDFs into one — practical PDF utilities for everyday work.",
    keywords: "PDF to Word online, PDF to Excel, merge PDF free, compress PDF online, PDF toolkit"
  },
  "/image-to-jpeg": {
    title: `Image converter (JPEG, PNG, WebP, BMP) | ${SITE_NAME}`,
    description:
      "Upload an image, pick output format and quality, and download — ideal for photos, screenshots, and graphics.",
    keywords: "image converter online, PNG to JPEG, WebP converter, BMP to JPG, free image format converter"
  },
  "/image-compressor": {
    title: `Image compressor — reduce photo size online | ${SITE_NAME}`,
    description:
      "Lower JPEG size with a quality slider and optional max width — keep visuals clear while saving bandwidth.",
    keywords: "compress JPEG online, reduce image file size, photo compressor, optimize images for web"
  },
  "/pdf-maker": {
    title: `JPG to PDF — images to one PDF | ${SITE_NAME}`,
    description:
      "Reorder photos, pick page size and margins, and build a polished PDF from your images in a few clicks.",
    keywords: "JPG to PDF, images to PDF online, create PDF from photos, combine pictures PDF"
  },
  "/pdf-convert": {
    title: `PDF to Word or Excel — extract tables & text | ${SITE_NAME}`,
    description:
      "Turn PDFs into editable DOCX or XLSX with tables or text-focused modes — built for reports and statements.",
    keywords: "PDF to Word online, PDF to Excel, extract tables from PDF, convert PDF to DOCX"
  },
  "/pdf-compressor": {
    title: `PDF compressor — smaller PDF files online | ${SITE_NAME}`,
    description:
      "Choose a compression level and download a lighter PDF — helpful for email attachments and uploads.",
    keywords: "compress PDF online, reduce PDF size, shrink PDF file, optimize PDF"
  },
  "/pdf-merge": {
    title: `Merge PDF — combine PDFs in order | ${SITE_NAME}`,
    description:
      "Upload multiple PDFs, arrange the order, and download a single merged document — quick and straightforward.",
    keywords: "merge PDF online, combine PDF files, join PDF free, concatenate PDF"
  },
  "/ocr": {
    title: `OCR — extract text from images & PDFs | ${SITE_NAME}`,
    description:
      "Pull plain text, PDF, or Word output from scans and documents with language-aware OCR — handy for digitizing paperwork.",
    keywords: "OCR online free, image to text, PDF OCR, extract text from scan, Tesseract OCR"
  },
  "/about": {
    title: `About ${SITE_NAME} — mission & tools`,
    description:
      "Learn what File Mitra offers: fast file utilities, privacy-minded processing, and a growing set of image and PDF workflows.",
    keywords: "about File Mitra, file utility suite, free online converters"
  },
  "/contact": {
    title: `Contact ${SITE_NAME}`,
    description:
      "Reach out with feedback, feature ideas, or support questions — we read every message.",
    keywords: "contact File Mitra, file converter support, feedback"
  },
  "/privacy-policy": {
    title: `Privacy policy | ${SITE_NAME}`,
    description:
      "How File Mitra handles your files and data: processing for conversions, no unnecessary retention, and practical privacy practices.",
    keywords: "File Mitra privacy, data policy, file processing privacy"
  }
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function getSeoForPath(pathname: string): RouteSeo {
  const key = normalizePath(pathname);
  return ROUTES[key] ?? ROUTES["/"];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applyRouteSeo(pathname: string): void {
  const path = normalizePath(pathname);
  const seo = getSeoForPath(path);
  const canonical = `${SITE_ORIGIN}${path === "/" ? "" : path}`;

  document.title = seo.title;

  upsertMeta("name", "description", seo.description);
  upsertMeta("name", "keywords", seo.keywords);
  upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

  upsertLink("canonical", canonical);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:locale", "en_IN");

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
}
