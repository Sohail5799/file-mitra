import { getBlogPostBySlug } from "../content/blogPosts";
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
      "Convert images to JPEG/PNG/WebP, compress photos and PDFs, merge PDFs, turn PDFs into Word or Excel, extract text with OCR, and build an ATS-friendly resume with live preview — fast, private, browser-based workflows.",
    keywords:
      "File Mitra, free PDF tools, free resume builder online, image to JPEG, compress PDF, merge PDF, PDF to Word, OCR online, ATS resume"
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
  "/qr-code": {
    title: `QR Code generator — custom link QR & PNG download | ${SITE_NAME}`,
    description:
      "Create a scannable QR code from any https link with validation, live preview, optional label, dot and corner styles, colors, and error correction — download PNG in one click.",
    keywords: "QR code generator online, free QR from URL, custom QR code, QR PNG download"
  },
  "/about": {
    title: `About ${SITE_NAME} — mission, tools & editorial guides`,
    description:
      "What File Mitra does: image and PDF utilities, OCR, QR codes, and a resume studio—plus long-form blog guides on formats, compression, and extraction limits.",
    keywords: "about File Mitra, file utility suite, PDF tools explained, image format guide"
  },
  "/contact": {
    title: `Contact ${SITE_NAME}`,
    description:
      "Reach out with feedback, feature ideas, or support questions — we read every message.",
    keywords: "contact File Mitra, file converter support, feedback"
  },
  "/how-it-works": {
    title: `How it works — usage guide | ${SITE_NAME}`,
    description:
      "Step-by-step overview of File Mitra: choosing tools, uploading files, tuning quality, downloads, privacy expectations, and troubleshooting before you contact support.",
    keywords: "File Mitra guide, how to use file converter, PDF tools tutorial, online OCR help"
  },
  "/privacy-policy": {
    title: `Privacy policy | ${SITE_NAME}`,
    description:
      "How File Mitra handles your files and data, including cookies, optional Google AdSense ads, and third-party advertising technologies — plus retention practices for conversions and contact messages.",
    keywords: "File Mitra privacy, AdSense cookies, data policy, file processing privacy"
  },
  "/terms": {
    title: `Terms and conditions | ${SITE_NAME}`,
    description:
      "Rules for using File Mitra: acceptable use, no warranties, liability limits, and how to contact us about legal questions.",
    keywords: "File Mitra terms, terms of use, conditions, legal"
  },
  "/blog": {
    title: `${SITE_NAME} Blog — guides on PDF & image workflows`,
    description:
      "Practical articles on JPEG vs PNG vs WebP, PDF compression, table extraction to Excel, OCR for scans, merging PDFs, and FAQs about using File Mitra safely.",
    keywords:
      "File Mitra blog, PDF tips, image compression guide, OCR guide, merge PDF tutorial, PDF to Excel help, file converter FAQ"
  },
  "/resume": {
    title: `Free resume builder — ATS-friendly CV & print PDF | ${SITE_NAME}`,
    description:
      "Build a structured resume with profile, summary, experience bullets, education, skills, and projects. Live A4 preview, JSON import/export, and print-to-PDF — runs entirely in your browser.",
    keywords:
      "free resume builder online, ATS friendly resume, CV maker India, print resume PDF, JSON resume, resume template browser"
  }
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function getSeoForPath(pathname: string): RouteSeo {
  const key = normalizePath(pathname);
  if (key.startsWith("/blog/")) {
    const slug = key.slice("/blog/".length);
    const post = getBlogPostBySlug(slug);
    if (post) {
      return {
        title: `${post.title} | ${SITE_NAME} Blog`,
        description: post.excerpt,
        keywords: `${post.keywords}, File Mitra blog, file conversion tips`
      };
    }
    return {
      title: `Article | ${SITE_NAME} Blog`,
      description: "Guides and tips for image and PDF workflows on File Mitra.",
      keywords: "File Mitra blog"
    };
  }
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

  const blogSlug = path.startsWith("/blog/") ? path.slice("/blog/".length) : "";
  const blogArticle = blogSlug ? getBlogPostBySlug(blogSlug) : undefined;
  upsertMeta("property", "og:type", blogArticle ? "article" : "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:locale", "en_IN");

  const ogImage = `${SITE_ORIGIN}/og-image.png`;
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("property", "og:image:alt", seo.title);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
  upsertMeta("name", "twitter:image", ogImage);
}
