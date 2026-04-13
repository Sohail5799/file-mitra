export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMin: number;
  keywords: string;
  sections: BlogBlock[];
};

const posts: BlogPost[] = [
  {
    slug: "ats-friendly-resume-bullets-recruiters-actually-read",
    title: "ATS-friendly resume bullets recruiters actually read",
    excerpt:
      "How to write impact lines that parse cleanly in applicant systems and still sound human in a six-second skim.",
    date: "2026-04-14",
    readMin: 11,
    keywords:
      "ATS resume tips, resume bullet points, STAR method resume, keyword stuffing avoid, resume scanner",
    sections: [
      {
        type: "p",
        text: "Most rejection happens before a human reads your nuance. Applicant tracking systems (ATS) split your file into text blocks, and recruiters skim the top third for role fit. Bullets that are vague (“responsible for…”) or buried in tables and text boxes may never surface the way you expect."
      },
      {
        type: "h2",
        text: "Lead with outcome, then mechanism"
      },
      {
        type: "p",
        text: "Strong bullets answer: what changed, for whom, and how you did it—with a number when honest. “Cut invoice processing time by 22% by automating validation in Python” beats “Worked on invoices.” If you cannot quantify, use scope: “Led discovery for 12 stakeholders across legal and finance.”"
      },
      {
        type: "h2",
        text: "Keywords without stuffing"
      },
      {
        type: "p",
        text: "Mirror the job description’s language for tools and domains you truly used—Kubernetes, GA4, SOC 2—but avoid repeating the same phrase ten times. Natural prose with synonyms usually parses better and reads better to humans."
      },
      {
        type: "h3",
        text: "Formatting that survives export"
      },
      {
        type: "ul",
        items: [
          "Prefer a single-column layout for the main story—multi-column Word docs can scramble order in some parsers.",
          "Use standard section titles: Experience, Education, Skills.",
          "Save final copies as PDF from a clean print layout; check that text is selectable."
        ]
      },
      {
        type: "callout",
        text: "Before you submit, paste your resume into a plain text editor once. If it reads in logical order there, you have a better shot with both ATS and tired hiring managers."
      }
    ]
  },
  {
    slug: "one-page-vs-two-page-resume-when-length-matters",
    title: "One-page vs two-page resume: when length actually matters",
    excerpt:
      "Students and career switchers are told “one page only.” Here is a more honest framework for India and global applications.",
    date: "2026-04-13",
    readMin: 9,
    keywords: "one page resume, two page CV, resume length India, experienced hire resume, academic CV",
    sections: [
      {
        type: "p",
        text: "Length rules are really about signal density. Early-career candidates rarely need two pages—every line should earn its place. Mid-career specialists with multiple shipped products, patents, or publications often need the second page; forcing one page can hide the exact proof a hiring manager searched for."
      },
      {
        type: "h2",
        text: "When one page is enough"
      },
      {
        type: "ul",
        items: [
          "Under ~5 years of relevant experience with a tight story.",
          "Switching roles within the same discipline and repeating similar bullets.",
          "Applying through high-volume portals where brevity helps skimming."
        ]
      },
      {
        type: "h2",
        text: "When two pages are defensible"
      },
      {
        type: "p",
        text: "Use page two for depth that repeats on every application: selected projects, open-source, speaking, or stacked certifications with dates. Put the strongest two roles on page one with your best metrics; page two should feel like supporting evidence, not filler."
      },
      {
        type: "h2",
        text: "Regional expectations"
      },
      {
        type: "p",
        text: "Some Indian campus hiring formats expect a strict one-pager; many product and SaaS teams hiring senior ICs are used to two pages if every line is specific. Tailor to the funnel: campus PDF vs LinkedIn export vs email to a founder."
      },
      {
        type: "callout",
        text: "If you add a second page, re-read page one in isolation: would a stranger still know what you want next? If not, fix page one before polishing page two."
      }
    ]
  },
  {
    slug: "jpeg-vs-png-vs-webp-choosing-image-format",
    title: "JPEG vs PNG vs WebP: choosing the right image format",
    excerpt:
      "A practical guide to picking raster formats for photos, UI assets, and the web—without overcomplicating your workflow.",
    date: "2026-03-18",
    readMin: 9,
    keywords: "JPEG vs PNG, WebP vs JPEG, when to use PNG, image format guide, web images",
    sections: [
      {
        type: "p",
        text: "Most teams do not need a dozen formats—they need a clear default. Raster formats trade off file size, transparency support, and how aggressively you can compress before artifacts show up. The goal is predictable quality at a size your page or email can tolerate."
      },
      {
        type: "h2",
        text: "When JPEG is still the right default"
      },
      {
        type: "p",
        text: "JPEG works well for continuous-tone images: photos, realistic renders, and screenshots with gradients. It does not support transparency. If you are exporting UI icons with alpha, JPEG is the wrong tool. For photos and thumbnails, a quality setting in the high 80s or low 90s is often a sweet spot before returns diminish."
      },
      {
        type: "h2",
        text: "PNG for sharp edges and transparency"
      },
      {
        type: "p",
        text: "PNG shines when you need lossless storage or an alpha channel—logos, diagrams, screenshots with crisp text, and small assets where compression artifacts would be obvious. The tradeoff is size: complex PNGs can be large. If you only need transparency for photos, consider WebP instead."
      },
      {
        type: "h2",
        text: "WebP as a modern compromise"
      },
      {
        type: "p",
        text: "WebP can deliver smaller files than JPEG at similar visual quality for many photos, and it supports transparency. Support across evergreen browsers is strong today. If your pipeline allows it, exporting WebP for marketing sites and product galleries can improve Largest Contentful Paint without a visible quality hit—provided you still keep fallbacks where your audience requires them."
      },
      {
        type: "callout",
        text: "Rule of thumb: photos → JPEG or WebP; UI with transparency → PNG or WebP; archival masters → PNG or TIFF outside the browser pipeline."
      },
      {
        type: "h2",
        text: "A simple decision checklist"
      },
      {
        type: "ul",
        items: [
          "Need alpha? Do not use JPEG.",
          "Need tiny files for a landing hero? Try WebP first, compare visually, then lock settings.",
          "Need a source-of-truth asset for designers? Prefer lossless or high-quality PNG until final export.",
          "Need email compatibility? JPEG remains the safest default for embedded photos."
        ]
      }
    ]
  },
  {
    slug: "reduce-pdf-size-without-ruining-readability",
    title: "How to reduce PDF size without ruining readability",
    excerpt:
      "Compression is not only about sliders—it is about what inside the PDF is actually costing you bytes.",
    date: "2026-03-22",
    readMin: 8,
    keywords: "compress PDF, reduce PDF file size, PDF optimization, scanned PDF smaller",
    sections: [
      {
        type: "p",
        text: "Large PDFs usually fall into two buckets: scanned documents where page images dominate the file size, and digitally born PDFs where fonts, vectors, and embedded assets matter. Your strategy should match the bucket—otherwise you will chase the wrong knob."
      },
      {
        type: "h2",
        text: "Scanned PDFs: images are the budget"
      },
      {
        type: "p",
        text: "If every page is effectively a photograph, shrinking the file means re-encoding those images. Aggressive settings can wash out small text or introduce banding in backgrounds. Start with a moderate profile, open the result at 100% zoom, and read a few representative lines—especially footnotes and light gray text."
      },
      {
        type: "h2",
        text: "Text-based PDFs: gains may be modest"
      },
      {
        type: "p",
        text: "When a PDF is mostly vector text and paths, there may not be much fat to trim. In those cases, the biggest wins come from removing duplicate fonts, flattening unnecessary layers, or re-exporting from the authoring tool. If compression barely changes the size, that is a signal you are already close to optimal for that content type."
      },
      {
        type: "h3",
        text: "Quality checks that catch real issues"
      },
      {
        type: "ul",
        items: [
          "Zoom to 125–150% on a page with fine print.",
          "Compare signatures and stamps after compression.",
          "Search the PDF after processing—OCR layers can interact oddly with some workflows."
        ]
      },
      {
        type: "callout",
        text: "If the PDF must be archived for compliance, keep an uncompressed or lightly compressed master, and ship a smaller derivative for email and web."
      }
    ]
  },
  {
    slug: "pdf-to-excel-when-table-extraction-works-best",
    title: "PDF to Excel: when table extraction works best",
    excerpt:
      "Tables mode shines on some documents and struggles on others. Here is how to set expectations before you export.",
    date: "2026-03-28",
    readMin: 10,
    keywords: "PDF to Excel, extract tables from PDF, bank statement PDF to spreadsheet, PDF tables",
    sections: [
      {
        type: "p",
        text: "Spreadsheet export from PDF is one of the most requested office workflows—and one of the easiest to misunderstand. A PDF can look like a perfect grid on screen while storing very little actual table structure. Extraction tools infer rows and columns from geometry and text flow, which works well until the layout fights back."
      },
      {
        type: "h2",
        text: "Where table-first extraction tends to win"
      },
      {
        type: "ul",
        items: [
          "Repeating grids with clear row boundaries (many operational reports).",
          "Numeric columns aligned consistently without heavy merged cells.",
          "Text that is selectable in the PDF viewer (usually a good sign it is not only a screenshot)."
        ]
      },
      {
        type: "h2",
        text: "Where it gets messy"
      },
      {
        type: "p",
        text: "Multi-line cells, nested headers, footnotes inside the grid, and tables split across pages can confuse heuristics. The same is true when designers use text boxes instead of a real table object. In those cases, you may still get a usable CSV-like export, but plan for cleanup in Excel."
      },
      {
        type: "h2",
        text: "A practical workflow"
      },
      {
        type: "p",
        text: "Export once with a tables-oriented mode, then validate totals and date columns against the PDF. If headers drift, fix them in Excel and save a template for the next monthly file. If the document is narrative-heavy, a Word-oriented path may save time even if you ultimately need numbers in a sheet."
      },
      {
        type: "callout",
        text: "If a single page mixes charts, callouts, and tables, export in chunks rather than expecting one pass to perfectly segment everything."
      }
    ]
  },
  {
    slug: "ocr-tips-for-scans-invoices-and-receipts",
    title: "OCR tips for scans, invoices, and receipts",
    excerpt:
      "Small capture improvements often beat fancier algorithms—especially for uneven lighting and phone photos.",
    date: "2026-04-02",
    readMin: 9,
    keywords: "OCR tips, scan to text, invoice OCR accuracy, receipt OCR, document digitization",
    sections: [
      {
        type: "p",
        text: "OCR quality is rarely only about the OCR engine. Capture conditions, skew, blur, and language settings drive a large share of errors. For receipts and invoices, the business goal is usually searchable text or pasteable line items—so aim for readability at the character level, not a beautiful photo."
      },
      {
        type: "h2",
        text: "Lighting and contrast matter more than megapixels"
      },
      {
        type: "p",
        text: "A steady photo with even lighting usually beats a high-resolution image with glare across the totals line. If you are using a phone, tap to expose on the text region and avoid flash hotspots on glossy paper. For desk scans, align the page edges and avoid curling corners that fall out of focus."
      },
      {
        type: "h2",
        text: "Language and character sets"
      },
      {
        type: "p",
        text: "Pick the language that matches the majority of the text. Mixed-language documents exist, but forcing the wrong primary language can increase substitutions. If your tool allows region selection, crop to the densest text block first, verify output, then widen the region."
      },
      {
        type: "h3",
        text: "Multi-page PDFs: pace the work"
      },
      {
        type: "p",
        text: "Long scans take longer to process and amplify small issues like repeated skew. Split large jobs into sections, validate the first pages, then continue—especially on slower devices or constrained networks."
      },
      {
        type: "ul",
        items: [
          "Rotate to reading orientation before OCR.",
          "Crop borders and binder holes when possible.",
          "For faint thermal receipts, duplicate contrast in an editor only if you keep the original image too."
        ]
      }
    ]
  },
  {
    slug: "merge-pdfs-order-bookmarks-and-pitfalls",
    title: "Merging PDFs: order, bookmarks, and common pitfalls",
    excerpt:
      "Combining files sounds trivial until page order, file size, and mixed page sizes create surprises in the final download.",
    date: "2026-04-08",
    readMin: 7,
    keywords: "merge PDF online, combine PDF order, join PDF files, PDF merge tips",
    sections: [
      {
        type: "p",
        text: "Merge is a workflow people assume is deterministic: concatenate bytes and done. In practice, the user problem is almost always about order—appendix before or after the contract, exhibits grouped together, and scanned batches arriving out of sequence. A merge tool should make reordering obvious because that is where mistakes happen."
      },
      {
        type: "h2",
        text: "Verify order twice on high-stakes packets"
      },
      {
        type: "p",
        text: "For court filings, loan packets, and HR bundles, scroll the merged preview if your tool offers it, or spot-check page ranges in a viewer after download. One reversed scan batch is enough to invalidate an entire submission."
      },
      {
        type: "h2",
        text: "Mixed page sizes and orientation"
      },
      {
        type: "p",
        text: "When one PDF is A4 and another includes landscape pages or mixed sizes, viewers may letterbox pages or reflow thumbnails in ways that look like errors even when the file is technically fine. If your destination requires uniform dimensions, normalize in the authoring step rather than expecting merge alone to redesign layouts."
      },
      {
        type: "callout",
        text: "If individual files are password-protected, unlock or decrypt them before merging—most merge flows expect readable inputs."
      }
    ]
  },
  {
    slug: "image-compression-for-web-core-web-vitals",
    title: "Image compression for the web and Core Web Vitals",
    excerpt:
      "Why responsive width matters as much as quality—and how to avoid shipping invisible pixels.",
    date: "2026-04-11",
    readMin: 8,
    keywords: "image compression web, Core Web Vitals images, resize images for web, LCP optimization",
    sections: [
      {
        type: "p",
        text: "Large images are one of the most common causes of slow Largest Contentful Paint (LCP). Teams often optimize quality while forgetting that they are still shipping a 4000px-wide hero into a 1200px layout. Downscaling in the browser helps, but you still pay for bytes on the wire."
      },
      {
        type: "h2",
        text: "Pair quality with dimensions"
      },
      {
        type: "p",
        text: "A sensible pipeline picks a maximum display width, then exports at 1x or 2x depending on your asset strategy. After resizing, apply compression. Doing both in the opposite order can leave redundant resolution that no amount of quality tuning removes."
      },
      {
        type: "h2",
        text: "Formats and caching"
      },
      {
        type: "p",
        text: "Use consistent URLs for static assets so caches work. If you version images with hashes at build time, remember that social previews and email clients may cache aggressively—plan how you bust caches when marketing swaps creatives."
      },
      {
        type: "ul",
        items: [
          "Measure before and after on real devices, not only desktop Chrome.",
          "Prefer modern formats where supported, with JPEG fallback paths if needed.",
          "Avoid ultra-high quality settings for thumbnails—human eyes are not inspecting them at full size."
        ]
      }
    ]
  }
];

export function getAllBlogPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
