import {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { Link } from "@tanstack/react-router";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";

/** Measured slide width in px — avoids %-flex rounding peek of adjacent slides. */
function PixelCarousel(props: { active: number; itemCount: number; children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [slidePx, setSlidePx] = useState(0);
  const slides = Children.toArray(props.children);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setSlidePx(w);
    };
    measure();
    const raf = requestAnimationFrame(() => measure());
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const { active, itemCount } = props;
  const basisPct = 100 / itemCount;
  const usePx = slidePx > 0;
  const offsetPx = usePx ? active * slidePx : 0;
  const trackW = usePx ? `${slidePx * itemCount}px` : `${itemCount * 100}%`;
  const pctShift = (active * 100) / itemCount;

  return (
    <div ref={viewportRef} className="min-w-0 w-full max-w-full overflow-x-hidden">
      <div
        className="flex transition-transform duration-500 ease-out will-change-transform motion-reduce:transform-none motion-reduce:transition-none"
        style={{
          width: trackW,
          transform: usePx ? `translate3d(${-offsetPx}px,0,0)` : `translate3d(-${pctShift}%,0,0)`
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="box-border min-w-0 shrink-0 overflow-hidden"
            style={{ width: usePx ? `${slidePx}px` : `${basisPct}%` }}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}

type FooterIconId =
  | "resume"
  | "image"
  | "imageCompress"
  | "pdfMaker"
  | "pdfConvert"
  | "pdfCompress"
  | "merge"
  | "ocr"
  | "qr";

const FOOTER_TOOL_LINKS: readonly { label: string; to: string; icon: FooterIconId }[] = [
  { label: "Resume Studio", to: "/resume", icon: "resume" },
  { label: "Image Converter", to: "/image-to-jpeg", icon: "image" },
  { label: "Image Compressor", to: "/image-compressor", icon: "imageCompress" },
  { label: "PDF Maker", to: "/pdf-maker", icon: "pdfMaker" },
  { label: "PDF to Excel/Doc", to: "/pdf-convert", icon: "pdfConvert" },
  { label: "PDF Compressor", to: "/pdf-compressor", icon: "pdfCompress" },
  { label: "Merge PDF", to: "/pdf-merge", icon: "merge" },
  { label: "OCR Extractor", to: "/ocr", icon: "ocr" },
  { label: "QR Code Generator", to: "/qr-code", icon: "qr" }
];

function FooterToolGlyph({ id, className = "h-5 w-5" }: { id: FooterIconId; className?: string }) {
  const stroke = { strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "resume":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
        </svg>
      );
    case "image":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 21h19.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H2.25A1.5 1.5 0 00.75 6v13.5A1.5 1.5 0 002.25 21z" />
          <path d="M9 10.5a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "imageCompress":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      );
    case "pdfMaker":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case "pdfConvert":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      );
    case "pdfCompress":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m7.5-3v6m-3-3h6" />
        </svg>
      );
    case "merge":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case "ocr":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M3.75 4.5v15m0-15h4.5m-4.5 0L9 9m-5.25-4.5L9 9m-5.25 4.5L9 15m-5.25-4.5h4.5m9-6v15m0-15h4.5m-4.5 0L15 9m5.25-4.5L15 9m5.25 4.5L15 15m5.25-4.5h-4.5" />
        </svg>
      );
    case "qr":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M3.75 4.5h4.5v4.5h-4.5V4.5zM15.75 4.5h4.5v4.5h-4.5V4.5zM3.75 15h4.5v4.5h-4.5V15zM16.5 15h1.5v1.5H16.5V15zM19.5 15h1.5v1.5H19.5V15zM16.5 19.5h1.5V18H16.5v1.5zM19.5 18h1.5v1.5H19.5V18zM12 12h1.5v1.5H12V12zM9 12h1.5v1.5H9V12zM12 9h1.5v1.5H12V9z" />
        </svg>
      );
    default:
      return null;
  }
}

export function HomePage() {
  const tools = useMemo(
    () =>
      [
        { title: "Image Tools", desc: "Convert and compress images in one place.", to: "/image-tools" },
        { title: "PDF Tools", desc: "Convert, compress and merge PDFs from one dashboard.", to: "/pdf-tools" },
        { title: "OCR Extractor", desc: "Extract text from images and PDFs.", to: "/ocr" },
        {
          title: "QR Generator",
          desc: "Create customizable QR codes from links with instant preview.",
          to: "/qr-code"
        },
        {
          title: "Resume Studio",
          desc: "ATS-style CV with live preview and print-to-PDF — no extra signup.",
          to: "/resume"
        }
      ] as const,
    []
  );

  const [activeTool, setActiveTool] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveTool((prev) => (prev + 1) % tools.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [tools.length]);

  return (
    <div className="space-y-6">
      <Section className="premium-hero">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-slate-400">
              One-click premium file workflows
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              Premium converter suite for daily work
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
              Transform, compress, merge, and OCR files in a focused interface. File Mitra is built for people
              who need dependable exports without installing desktop suites—students finishing assignments,
              freelancers sending client-ready PDFs, and teams standardizing scans before they hit the inbox.
            </p>
            <div className="mt-3 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center">
              <Link to="/pdf-tools" className="btn-primary w-full justify-center min-[400px]:w-auto">
                Open PDF Tools
              </Link>
              <Link to="/image-tools" className="btn-secondary w-full justify-center min-[400px]:w-auto">
                Open Image Tools
              </Link>
              <Link to="/resume" className="btn-secondary w-full justify-center min-[400px]:w-auto">
                Resume Studio
              </Link>
              <Link to="/qr-code" className="btn-secondary w-full justify-center min-[400px]:w-auto">
                QR Generator
              </Link>
              <Link to="/blog" className="btn-secondary w-full justify-center min-[400px]:w-auto">
                Guides &amp; blog
              </Link>
              <Link to="/how-it-works" className="btn-secondary w-full justify-center min-[400px]:w-auto">
                How it works
              </Link>
            </div>
          </div>

          <div className="surface-muted min-w-0 p-4">
            <div className="pl-0.5 pt-0.5 text-xs uppercase tracking-wide text-slate-400">
              Tools carousel
            </div>
            <div className="relative mt-3 min-w-0 max-w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4">
              <PixelCarousel active={activeTool} itemCount={tools.length}>
                {tools.map((tool) => (
                  <div key={tool.title} className="min-w-0 pr-1">
                    <div className="text-lg font-semibold text-white">{tool.title}</div>
                    <p className="mt-1 text-sm text-slate-300">{tool.desc}</p>
                    <Link to={tool.to} className="btn-secondary mt-4">
                      Open Tool
                    </Link>
                  </div>
                ))}
              </PixelCarousel>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              {tools.map((tool, idx) => (
                <button
                  key={tool.title}
                  type="button"
                  onClick={() => setActiveTool(idx)}
                  className={
                    idx === activeTool
                      ? "h-2.5 w-2.5 scale-125 rounded-full bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                      : "h-2.5 w-2.5 rounded-full bg-white/30"
                  }
                  aria-label={`Go to tool ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Resume Studio"
        description="Structured sections, impact bullets, and a print-ready A4 canvas — built for real job searches, not toy templates."
      >
        <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
          <div className="space-y-3">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
              <li>Live preview that tracks every edit — no mode switching.</li>
              <li>Experience blocks with reorderable bullets tuned for hiring managers.</li>
              <li>Scrollable live preview so long CVs stay readable before you print.</li>
              <li>Print-to-PDF using your browser — no server upload of your CV.</li>
            </ul>
            <Link to="/resume" className="btn-primary inline-flex">
              Open Resume Studio
            </Link>
          </div>
          <div className="surface-muted relative overflow-hidden rounded-2xl p-5">
            <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview snapshot</div>
            <p className="mt-1 text-[10px] text-slate-500">Fictional example for layout demonstration only.</p>
            <div className="mt-3 space-y-2 rounded-lg border border-white/10 bg-white p-4 text-[11px] leading-snug text-slate-800 shadow-lg">
              <div className="text-[13px] font-bold text-slate-900">Aanya Sharma</div>
              <div className="text-[10px] text-slate-600">Product Designer · Design Systems</div>
              <div className="h-px bg-slate-200" />
              <div className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Summary</div>
              <p className="text-[9px] text-slate-700">
                Designer focused on clarity, accessibility, and measurable outcomes…
              </p>
              <div className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Experience</div>
              <p className="text-[9px] text-slate-700">Northwind Labs — Senior Product Designer · 2023–Present</p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Why this site exists"
        description="File utilities are easy to find online—harder to find ones that explain trade-offs, respect privacy, and stay readable. This section is for visitors (and reviewers) who want context, not just buttons."
      >
        <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
          <p>
            Every tool here is meant to solve a narrow job well: pick a format, tune quality, download the
            result. Where it matters, the{" "}
            <Link to="/blog" className="font-medium text-white underline-offset-2 hover:underline">
              blog
            </Link>{" "}
            walks through real-world choices—when WebP beats JPEG, how PDF table extraction can drift from the
            original layout, and how to prep scans so OCR fails less often.
          </p>
          <p>
            We do not ask you to create an account for these flows. Files are processed to complete the task
            you started; treat anything sensitive according to your own policies, and read the{" "}
            <Link to="/privacy-policy" className="font-medium text-white underline-offset-2 hover:underline">
              privacy policy
            </Link>{" "}
            for how we approach data handling and retention at a high level.
          </p>
          <p>
            Useful sites should still read well without running a tool first. That is why the homepage, about
            page, and articles are written as standalone references—not filler around a single upload box.
          </p>
        </div>
      </Section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Practical scope"
          description="Converters, compression, merge, OCR, QR, and an in-browser resume studio—each with clear inputs and downloads."
        >
          <p className="mt-2 text-sm text-slate-400">
            Pick a workflow from the nav or tool grid; you always land on an explanation before the controls.
          </p>
        </Card>
        <Card
          title="Editorial depth"
          description="Long-form guides on formats, PDF behavior, OCR limits, and resume structure—not keyword stubs."
        >
          <p className="mt-2 text-sm text-slate-400">
            Start on the{" "}
            <Link to="/blog" className="text-indigo-200 hover:text-white">
              blog index
            </Link>{" "}
            for the newest articles.
          </p>
        </Card>
        <Card
          title="Privacy-minded design"
          description="No login wall for the tools shown here; processing is tied to the task you run, not a personal media library."
        >
          <p className="mt-2 text-sm text-slate-400">
            Questions? Use{" "}
            <Link to="/contact" className="text-indigo-200 hover:text-white">
              contact
            </Link>
            —we read thoughtful feedback.
          </p>
        </Card>
      </div>

      <Section
        title="Common use cases"
        description="Illustrative scenarios— not paid endorsements or guaranteed outcomes for any third party."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="surface-muted rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white">Students &amp; coursework</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Turn camera scans into smaller PDFs, extract text for quotes, or convert screenshots to a required
              format before uploading to a portal.
            </p>
          </div>
          <div className="surface-muted rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white">Freelancers &amp; job seekers</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Refresh a CV in the resume studio, export a print-friendly PDF, and compress portfolio images before
              sending a single attachment.
            </p>
          </div>
          <div className="surface-muted rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white">Small business &amp; shops</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Merge invoices into one file for accounting, generate a QR code for a menu or payment link, and shrink
              PDFs that bounce back from email size limits.
            </p>
          </div>
          <div className="surface-muted rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white">Office paperwork</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              OCR a signed scan, try table extraction when a statement is digitally authored, and keep originals until
              you verify the export.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Need the full walkthrough? Read the{" "}
          <Link to="/how-it-works" className="text-slate-400 underline-offset-2 hover:text-white">
            usage guide
          </Link>
          .
        </p>
      </Section>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.11] bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-indigo-950/55 p-5 shadow-[0_28px_90px_-28px_rgba(15,23,42,0.9)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-xl sm:p-7 lg:p-8">
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.04)_48%,transparent_56%)]" aria-hidden />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:items-start lg:gap-12">
          <div className="max-w-sm">
            <div className="text-xl font-semibold tracking-tight text-white">Converter</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Fast file tools for daily workflow.
            </p>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tools</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {FOOTER_TOOL_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group relative flex min-h-[3.25rem] items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3 text-left shadow-sm transition duration-200 will-change-transform hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.07] hover:shadow-[0_12px_40px_-16px_rgba(34,211,238,0.25)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-cyan-500/15 text-cyan-100/90 ring-1 ring-white/10 transition group-hover:from-indigo-400/35 group-hover:to-cyan-400/25 group-hover:text-white group-hover:ring-cyan-300/20">
                    <FooterToolGlyph id={item.icon} />
                  </span>
                  <span className="min-w-0 text-sm font-medium leading-snug text-slate-200 transition group-hover:text-white">
                    {item.label}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
