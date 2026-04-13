import clsx from "clsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { Section } from "../../ui/Section";
import { ResumeCanvas } from "./ResumeCanvas";
import { ResumeForm } from "./ResumeForm";
import type { ResumeModel } from "./resumeTypes";
import { useResumeEditor } from "./useResumeEditor";

const MM_TO_PX = 96 / 25.4;
const A4_HEIGHT_PX = 297 * MM_TO_PX;
/** Slightly under full A4 so typical browser print margins still yield one page. */
const FIT_TARGET_PX = A4_HEIGHT_PX * 0.92;
const SCALE_MIN = 0.5;
const SCALE_MAX = 1;

/** Live preview mirror (desktop only). */
function ResumePreviewMirror({
  model,
  printScale,
  className
}: {
  model: ResumeModel;
  printScale: number;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-[210mm] min-w-0 max-w-full", className)}>
      <div
        className="resume-print-export-root bg-white shadow-2xl print:shadow-none"
        style={{
          width: "210mm",
          maxWidth: "100%",
          overflow: "hidden",
          ...( { zoom: printScale } as CSSProperties )
        }}
      >
        <div style={{ width: "210mm", maxWidth: "100%" }}>
          <ResumeCanvas model={model} />
        </div>
      </div>
    </div>
  );
}

export function ResumeBuilderPage() {
  const exportRef = useRef<HTMLDivElement>(null);
  const scaleInnerRef = useRef<HTMLDivElement>(null);
  const [printScale, setPrintScale] = useState(SCALE_MAX);
  const [isDownloading, setIsDownloading] = useState(false);
  const { model, dispatch } = useResumeEditor();

  const fitToOnePage = useCallback(() => {
    const inner = scaleInnerRef.current;
    if (!inner) return;
    const rectH = inner.getBoundingClientRect().height;
    if (rectH <= 0) return;
    const natural = rectH / printScale;
    const next = Math.min(SCALE_MAX, Math.max(SCALE_MIN, (FIT_TARGET_PX / natural) * 0.98));
    setPrintScale(next);
  }, [printScale]);

  const handleDownloadPdf = useCallback(async () => {
    const el = exportRef.current;
    if (!el || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true
      });
      const img = canvas.toDataURL("image/jpeg", 0.96);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });
      pdf.addImage(img, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      const filename = `${(model.profile.fullName || "Resume").replace(/\s+/g, "-")}-FileMitra.pdf`;
      pdf.save(filename);
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, model.profile.fullName]);

  const printScalePanel = (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Print scale</div>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
            Lower the slider (or use Fit one page) so a dense résumé fits one A4 in the PDF.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={SCALE_MIN}
              max={SCALE_MAX}
              step={0.01}
              value={printScale}
              onChange={(e) => setPrintScale(Number(e.target.value))}
              className="h-2 w-36 max-w-[50vw] cursor-pointer accent-indigo-400 sm:w-44"
              aria-label="Print scale"
            />
            <span className="w-10 tabular-nums text-xs font-medium text-slate-200">
              {Math.round(printScale * 100)}%
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={fitToOnePage}>
              Fit one page
            </button>
            <button
              type="button"
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
              onClick={() => setPrintScale(SCALE_MAX)}
            >
              Reset 100%
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <Section
          title="Resume Studio"
          description="Fill in your résumé below. Desktop shows a live A4 preview; on phones preview is hidden for a cleaner editor. Download PDF directly without opening the browser print dialog."
          titleLevel={1}
        />

        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,40%)_minmax(0,60%)] xl:grid-cols-[minmax(0,36%)_minmax(0,64%)]">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center md:hidden">
              <button
                type="button"
                className="btn-primary shrink-0 px-5 py-2.5 text-sm shadow-[0_0_24px_rgba(129,140,248,0.35)]"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
              >
                {isDownloading ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                type="button"
                className="btn-secondary shrink-0 px-5 py-2.5 text-sm"
                onClick={() => {
                  if (
                    window.confirm(
                      "Clear all resume fields and start fresh? This cannot be undone (save a PDF first if you need a copy)."
                    )
                  ) {
                    dispatch({ type: "RESET_EMPTY" });
                    setPrintScale(SCALE_MAX);
                  }
                }}
              >
                Clear all
              </button>
            </div>

            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Editor</h2>
            <ResumeForm model={model} dispatch={dispatch} />
          </div>

          <div className="hidden min-w-0 md:block lg:sticky lg:top-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Live preview</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  True A4 width for desktop editing. PDF download uses this same scaled layout on export.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 min-[380px]:w-auto min-[380px]:flex-row min-[380px]:justify-end">
                <button
                  type="button"
                  className="btn-primary shrink-0 px-5 py-2.5 text-sm shadow-[0_0_24px_rgba(129,140,248,0.35)]"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Generating PDF..." : "Download PDF"}
                </button>
                <button
                  type="button"
                  className="btn-secondary shrink-0 px-5 py-2.5 text-sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Clear all resume fields and start fresh? This cannot be undone (use Save as PDF first if you need a copy)."
                      )
                    ) {
                      dispatch({ type: "RESET_EMPTY" });
                      setPrintScale(SCALE_MAX);
                    }
                  }}
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="mt-3">{printScalePanel}</div>

            <div className="resume-preview-frame mt-4">
              <div className="resume-preview-inner">
                <div className="resume-preview-scroll max-h-[min(92vh,calc(100dvh-4rem))] overflow-auto overscroll-contain px-2 py-4 sm:px-5 sm:py-6">
                  <div className="mx-auto flex min-w-0 justify-center pb-8 pt-1">
                    <ResumePreviewMirror model={model} printScale={printScale} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single export DOM — off-screen but fully laid out for canvas -> PDF. */}
      <div
        className="pointer-events-none fixed -left-[10000px] top-0 -z-10 w-[210mm]"
        aria-hidden
        tabIndex={-1}
      >
        <div
          ref={exportRef}
          className="resume-print-export-root bg-white"
          style={{
            width: "210mm",
            maxWidth: "100%",
            height: "297mm",
            overflow: "hidden",
            ...( { zoom: printScale } as CSSProperties )
          }}
        >
          <div ref={scaleInnerRef} style={{ width: "210mm", maxWidth: "100%" }}>
            <ResumeCanvas model={model} />
          </div>
        </div>
      </div>
    </>
  );
}
