import { useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { convertImage, type ImageFormat } from "../../lib/api";
import { downloadBlob } from "../../lib/download";
import { showError, showSuccess } from "../../lib/alerts";

type Stage = "idle" | "ready" | "uploading" | "done" | "error";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function safeBaseName(name: string) {
  const base = (name || "image").replace(/\.[^/.]+$/, "");
  return base.trim() || "image";
}

export function ImageJpegConverter() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [quality, setQuality] = useState<number>(92);
  const [format, setFormat] = useState<ImageFormat>("jpeg");

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const convert = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      setStage("uploading");
      return await convertImage({ file, quality, format });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename: `${safeBaseName(filename)}.${format}` });
      setStage("done");
      void showSuccess("Image converted successfully.");
    },
    onError: (error) => {
      setStage("error");
      void showError((error as Error).message);
    }
  });

  function pick() {
    inputRef.current?.click();
  }

  function onFileSelected(f: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setStage(f ? "ready" : "idle");
  }

  function onDrop(ev: React.DragEvent) {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0] || null;
    if (f) onFileSelected(f);
  }

  const busy = stage === "uploading" || convert.isPending;
  const supportsQuality = format === "jpeg" || format === "webp";

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-300">
          Pick a file, Then convert. Download starts automatically.
        </div>
        <div className="flex items-center gap-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ImageFormat)}
            className="select"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
            <option value="bmp">BMP</option>
          </select>
          <button
            onClick={pick}
            disabled={busy}
            className="btn-secondary disabled:opacity-60"
          >
            Choose file
          </button>
          <button
            onClick={() => convert.mutate()}
            disabled={!file || busy}
            className="btn-primary disabled:opacity-60"
          >
            {busy ? "Converting..." : `Convert to ${format.toUpperCase()}`}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0] || null)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-muted p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-200">Input</div>
            {file ? (
              <div className="text-xs text-slate-400">{formatBytes(file.size)}</div>
            ) : null}
          </div>

          <div className="mt-3">
            {previewUrl ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-56 w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/10 text-sm text-slate-400">
                Drop an image here
              </div>
            )}
          </div>

          {/* <div className="mt-3 text-xs text-slate-400">
            Backend converts using FastAPI + Pillow.
          </div> */}
        </div>

        <div className="surface-muted p-4">
          <div className="text-sm font-medium text-slate-200">Output</div>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                {format.toUpperCase()}
              </div>
              <div
                className={clsx(
                  "text-xs",
                  stage === "done"
                    ? "text-emerald-300"
                    : stage === "error"
                      ? "text-rose-300"
                      : "text-slate-400"
                )}
              >
                {stage === "idle"
                  ? "Waiting"
                  : stage === "ready"
                    ? "Ready"
                    : stage === "uploading"
                      ? "Converting"
                      : stage === "done"
                        ? "Downloaded"
                        : "Failed"}
              </div>
            </div>

            {supportsQuality ? (
              <div className="mt-4">
                <label className="text-xs text-slate-400">Quality: {quality}</label>
                <input
                  className="mt-2 w-full accent-white"
                  type="range"
                  min={40}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={busy}
                />
                <div className="mt-2 text-xs text-slate-400">
                  Higher quality = bigger file.
                </div>
              </div>
            ) : (
              <div className="mt-4 text-xs text-slate-400">
                Quality setting is not used for {format.toUpperCase()}.
              </div>
            )}
          </div>

          {convert.error ? (
            <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
              {(convert.error as Error).message}
            </div>
          ) : null}

          <div className="mt-3 text-xs text-slate-400">
            Auto-download happens right after conversion.
          </div>
        </div>
      </div>
    </div>
  );
}

