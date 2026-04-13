import { useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { makePdf } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

type PageSize = "a4" | "letter";
type Orientation = "portrait" | "landscape";

export function PdfMakerPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(24);

  const createPdf = useMutation({
    mutationFn: async () =>
      makePdf({
        files,
        pageSize,
        orientation,
        margin
      }),
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDF created successfully.");
    },
    onError: (error) => {
      void showError((error as Error).message);
    }
  });

  const busy = createPdf.isPending;
  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files]
  );

  function pickFiles() {
    inputRef.current?.click();
  }

  function appendFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!incoming.length) return;
    setFiles((prev) => [...prev, ...incoming]);
  }

  function onDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    appendFiles(ev.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    setFiles((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    setFiles((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

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

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <Section
          title="JPG to PDF"
          description="Upload images, set page options, and download one PDF."
        >
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center"
            >
              <div className="text-base font-semibold text-white">
                Drop image files here
              </div>
              <div className="mt-1 text-sm text-slate-300">
                PNG, JPG, WEBP and more
              </div>
              <button
                onClick={pickFiles}
                disabled={busy}
                className="mt-4 btn-primary disabled:opacity-60"
              >
                Choose Files
              </button>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => appendFiles(e.target.files)}
              />
            </div>

            <Card title="Settings">
              <div className="grid gap-3">
                <label className="text-xs text-slate-400">Page size</label>
                <div className="flex gap-2">
                  {(["a4", "letter"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setPageSize(v)}
                      className={
                        pageSize === v
                          ? "rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                          : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                      }
                    >
                      {v.toUpperCase()}
                    </button>
                  ))}
                </div>

                <label className="mt-2 text-xs text-slate-400">Orientation</label>
                <div className="flex gap-2">
                  {(["portrait", "landscape"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setOrientation(v)}
                      className={
                        orientation === v
                          ? "rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                          : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                      }
                    >
                      {v[0].toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                <label className="mt-2 text-xs text-slate-400">Margin: {margin}px</label>
                <input
                  className="w-full accent-white"
                  type="range"
                  min={0}
                  max={80}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                />
              </div>
            </Card>

            <Card title={`Files (${files.length})`}>
              {files.length === 0 ? (
                <div className="text-sm text-slate-300">No files selected.</div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">
                          {index + 1}. {file.name}
                        </div>
                        <div className="text-xs text-slate-400">{formatBytes(file.size)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveUp(index)}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                        >
                          Up
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                        >
                          Down
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/15"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    Ready to create PDF
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {files.length} file(s) • {formatBytes(totalSize)}
                  </div>
                </div>
                <button
                  onClick={() => createPdf.mutate()}
                  disabled={!files.length || busy}
                  className="btn-primary disabled:opacity-60"
                >
                  {busy ? "Creating PDF..." : "Convert to PDF"}
                </button>
              </div>
              {createPdf.error ? (
                <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                  {(createPdf.error as Error).message}
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      </div>

      <aside className="md:col-span-1 space-y-4">
        <Card title="How it works">
          <ol className="list-decimal space-y-2 pl-4 text-sm text-slate-300">
            <li>Upload one or multiple images</li>
            <li>Reorder files if needed</li>
            <li>Choose page size/orientation</li>
            <li>Download generated PDF</li>
          </ol>
        </Card>
        <Card title="Output tips">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Keep similar image dimensions for neat pages.</li>
            <li>Use lower margin for larger page content.</li>
            <li>A4 portrait works best for document uploads.</li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}

