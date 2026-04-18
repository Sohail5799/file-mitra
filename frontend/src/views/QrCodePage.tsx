import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel } from "qr-code-styling";
import QRCodeStyling from "qr-code-styling";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { validateWebUrl } from "../lib/validateWebUrl";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

const DOT_TYPES: DotType[] = ["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"];
const CORNER_SQUARE_TYPES: CornerSquareType[] = ["square", "dot", "extra-rounded", "rounded", "dots", "classy", "classy-rounded"];
const CORNER_DOT_TYPES: CornerDotType[] = ["square", "dot", "rounded", "dots", "classy", "classy-rounded", "extra-rounded"];
const EC_LEVELS: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

type CaptionCorner = "none" | "tl" | "tr" | "bl" | "br" | "bottom";

const CAPTION_POSITION_CLASSES: Record<Exclude<CaptionCorner, "none">, string> = {
  tl: "left-2 top-2 text-left",
  tr: "right-2 top-2 text-right",
  bl: "bottom-2 left-2 text-left",
  br: "bottom-2 right-2 text-right",
  bottom: "bottom-2 left-2 right-2 text-center"
};

function useDebounced<T>(value: T, ms: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setD(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return d;
}

export function QrCodePage() {
  const [urlInput, setUrlInput] = useState("");
  const debouncedUrl = useDebounced(urlInput, 350);
  const validation = useMemo(() => validateWebUrl(debouncedUrl), [debouncedUrl]);

  const [size, setSize] = useState(280);
  const [margin, setMargin] = useState(8);
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [dotType, setDotType] = useState<DotType>("rounded");
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>("extra-rounded");
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>("dot");
  const [fg, setFg] = useState("#0f172a");
  const [bg, setBg] = useState("#ffffff");
  const [badge, setBadge] = useState("");
  const [badgeCorner, setBadgeCorner] = useState<CaptionCorner>("none");
  const [badgeTextColor, setBadgeTextColor] = useState("#0f172a");
  const [badgeBgColor, setBadgeBgColor] = useState("#ffffff");
  const [downloading, setDownloading] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  const badgeTrim = badge.trim().slice(0, 48);
  const showBadge = badgeTrim.length > 0 && badgeCorner !== "none";

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    if (!validation.ok) {
      QRCodeStyling._clearContainer(el);
      qrRef.current = null;
      return;
    }

    const opts = {
      type: "canvas" as const,
      width: size,
      height: size,
      data: validation.href,
      margin,
      qrOptions: {
        errorCorrectionLevel: ecLevel
      },
      dotsOptions: {
        type: dotType,
        color: fg
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: fg
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: fg
      },
      backgroundOptions: {
        color: bg
      }
    };

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(opts);
      qrRef.current.append(el);
    } else {
      qrRef.current.update(opts);
    }
  }, [
    validation,
    size,
    margin,
    ecLevel,
    dotType,
    cornerSquareType,
    cornerDotType,
    fg,
    bg
  ]);

  const onDownload = useCallback(async () => {
    if (!validation.ok) {
      void showError(validation.message);
      return;
    }
    const root = exportRef.current;
    if (!root) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(root, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not create image."));
              return;
            }
            try {
              const host = new URL(validation.href).hostname.replace(/[^a-z0-9.-]/gi, "_");
              downloadBlob({ blob, filename: `qrcode-${host || "link"}-${Date.now()}.png` });
              void showSuccess("QR code downloaded.");
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          "image/png",
          1
        );
      });
    } catch (e) {
      void showError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  }, [validation]);

  const liveCheck = useMemo(() => validateWebUrl(urlInput.trim()), [urlInput]);
  const showLiveError = urlInput.trim().length > 0 && !liveCheck.ok;

  return (
    <Section
      title="QR Code Generator"
      description="Paste a valid http(s) link, customize the code, preview it, then download a PNG — all in your browser."
      titleLevel={1}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:items-start">
        <div className="space-y-4">
        <Card title="Link & badge">
          <label className="text-xs text-slate-400">URL (validated)</label>
          <input
            className="input mt-1 font-mono text-xs sm:text-sm"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/page"
            autoComplete="url"
            spellCheck={false}
          />
          {showLiveError ? (
            <p className="mt-2 text-xs text-rose-300">{liveCheck.message}</p>
          ) : validation.ok ? (
            <p className="mt-2 break-all text-xs text-emerald-200/90">Encoding: {validation.href}</p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">Type a full URL; https:// is added if you omit it.</p>
          )}

          <label className="mt-4 block text-xs text-slate-400">Optional badge text (max 48 chars)</label>
          <input
            className="input mt-1"
            value={badge}
            onChange={(e) => setBadge(e.target.value.slice(0, 48))}
            placeholder="e.g. Scan me · My shop"
          />

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div>
              <label className="text-xs text-slate-400">Badge position</label>
              <select
                className="select mt-1 w-full"
                value={badgeCorner}
                onChange={(e) => setBadgeCorner(e.target.value as CaptionCorner)}
              >
                <option value="none">No badge</option>
                <option value="tl">Top left</option>
                <option value="tr">Top right</option>
                <option value="bl">Bottom left</option>
                <option value="br">Bottom right</option>
                <option value="bottom">Bottom center</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Badge text</label>
              <div className="color-control mt-1">
                <input
                  type="color"
                  className="color-control__picker"
                  value={badgeTextColor}
                  onChange={(e) => setBadgeTextColor(e.target.value)}
                />
                <input
                  className="color-control__hex"
                  value={badgeTextColor}
                  onChange={(e) => setBadgeTextColor(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400">Badge bg</label>
              <div className="color-control mt-1">
                <input
                  type="color"
                  className="color-control__picker"
                  value={badgeBgColor}
                  onChange={(e) => setBadgeBgColor(e.target.value)}
                />
                <input
                  className="color-control__hex"
                  value={badgeBgColor}
                  onChange={(e) => setBadgeBgColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Style">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Size ({size}px)</label>
              <input
                type="range"
                className="mt-2 w-full accent-indigo-400"
                min={200}
                max={420}
                step={10}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Quiet zone ({margin})</label>
              <input
                type="range"
                className="mt-2 w-full accent-indigo-400"
                min={0}
                max={24}
                step={1}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Error correction</label>
              <select
                className="select mt-1 w-full"
                value={ecLevel}
                onChange={(e) => setEcLevel(e.target.value as ErrorCorrectionLevel)}
              >
                {EC_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l} {l === "H" ? "(best for logos / damage)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Dot shape</label>
              <select
                className="select mt-1 w-full"
                value={dotType}
                onChange={(e) => setDotType(e.target.value as DotType)}
              >
                {DOT_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Finder corners (square)</label>
              <select
                className="select mt-1 w-full"
                value={cornerSquareType}
                onChange={(e) => setCornerSquareType(e.target.value as CornerSquareType)}
              >
                {CORNER_SQUARE_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Finder corners (inner dot)</label>
              <select
                className="select mt-1 w-full"
                value={cornerDotType}
                onChange={(e) => setCornerDotType(e.target.value as CornerDotType)}
              >
                {CORNER_DOT_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Foreground</label>
              <div className="color-control mt-1">
                <input
                  type="color"
                  className="color-control__picker"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                />
                <input className="color-control__hex" value={fg} onChange={(e) => setFg(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400">Background</label>
              <div className="color-control mt-1">
                <input
                  type="color"
                  className="color-control__picker"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                />
                <input className="color-control__hex" value={bg} onChange={(e) => setBg(e.target.value)} />
              </div>
            </div>
          </div>
        </Card>
        </div>

      <Card title="Live Preview" className="xl:sticky xl:top-28">
        <div className="flex flex-col items-center gap-4">
          <div
            ref={exportRef}
            className="relative inline-block rounded-2xl border border-white/10 p-4 shadow-lg"
            style={{ backgroundColor: bg }}
          >
            <div ref={mountRef} className="flex justify-center" />
            {showBadge ? (
              <span
                className={`pointer-events-none absolute z-10 max-w-[calc(100%-1rem)] truncate rounded-full px-2.5 py-1 text-[11px] font-semibold leading-tight shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:text-xs ${CAPTION_POSITION_CLASSES[badgeCorner]}`}
                style={{ color: badgeTextColor, backgroundColor: badgeBgColor }}
              >
                {badgeTrim}
              </span>
            ) : null}
          </div>
          <div className="w-full max-w-xs space-y-2 text-center">
            <p className="text-xs text-slate-400">
              Download captures the preview frame (QR + badge) as a high-resolution PNG.
            </p>
            <button
              type="button"
              className="btn-primary w-full disabled:opacity-50"
              disabled={!validation.ok || downloading}
              onClick={() => void onDownload()}
            >
              {downloading ? "Preparing…" : "Download PNG"}
            </button>
          </div>
        </div>
      </Card>
      </div>
    </Section>
  );
}
