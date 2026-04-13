import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { convertPdf } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

type Output = "Excel (.xlsx)" | "Word (.docx)";

// function ComingSoonBadge() {
//   return (
//     // <div className="pill border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
//     //   <span className="h-2 w-2 rounded-full bg-emerald-300/90" />
//     //   Live
//     // </div>
//   );
// }

export function PdfConvertPage() {
  const [output, setOutput] = useState<Output>("Excel (.xlsx)");
  const [mode, setMode] = useState<"Tables" | "Text">("Tables");
  const [hint, setHint] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const converter = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please choose a PDF file.");
      const out = output.includes("xlsx") ? "xlsx" : "docx";
      const m = mode.toLowerCase() as "tables" | "text";
      return convertPdf({ file, output: out, mode: m });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDF converted successfully.");
    },
    onError: (error) => {
      void showError((error as Error).message);
    }
  });

  const busy = converter.isPending;
  const canConvert = Boolean(file) && !busy;
  const fileSizeLabel = file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "No file";

  const suggested = useMemo(() => {
    const h = hint.trim().toLowerCase();
    if (!h) return "Upload a PDF to start.";
    if (h.includes("statement") || h.includes("bank") || h.includes("table"))
      return "Suggestion: Tables → Excel will work best for statements.";
    if (h.includes("contract") || h.includes("agreement"))
      return "Suggestion: Text → Word will be easier to edit.";
    return "We’ll use the best extraction strategy based on your selection.";
  }, [hint]);

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <Section
          title="PDF → Excel/Doc"
          description="Convert PDFs into editable formats for everyday work."
          // right={<ComingSoonBadge />}
        >
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="surface-muted p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Selected File</div>
              <div className="mt-2 truncate text-sm font-medium text-white">{file?.name || "No PDF selected"}</div>
              <div className="mt-1 text-xs text-slate-400">{fileSizeLabel}</div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Output</div>
              <div className="mt-2 text-sm font-medium text-white">{output}</div>
              <div className="mt-1 text-xs text-slate-400">Extract mode: {mode}</div>
            </div>
            <div className="surface-muted p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Status</div>
              <div className="mt-2 text-sm font-medium text-white">
                {busy ? "Converting..." : canConvert ? "Ready to convert" : "Waiting for input"}
              </div>
              <div className="mt-1 text-xs text-slate-400">Auto download after completion</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <Card
                title="1) Upload PDF"
                description="Drop a PDF (bank statement, report, invoice, etc.)."
              >
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  id="pdf-input"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="pdf-input"
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {file ? "Change PDF" : "Choose PDF"}
                </label>
                <div className="mt-2 text-xs text-slate-400">
                  {file ? `${file.name}` : "Best with text-based PDFs."}
                </div>
              </Card>

              <Card
                title="2) Output Configuration"
                description="Choose format and extraction strategy."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-slate-500">Output format</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(["Excel (.xlsx)", "Word (.docx)"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setOutput(v)}
                          className={
                            output === v
                              ? "rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                              : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                          }
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Extract</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(["Tables", "Text"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setMode(v)}
                          className={
                            mode === v
                              ? "rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                              : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                          }
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-300">
                  Selected: {mode} → {output}
                </div>
              </Card>

              <Card
                title="3) What are you converting?"
                description="This helps choose the best strategy."
              >
                <input
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder='e.g. "bank statement table"'
                  className="input"
                />
                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-300">
                  {suggested}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card
                title="4) Convert & Download"
                description="Final output is downloaded automatically."
                className="h-full"
              >
                <button
                  onClick={() => converter.mutate()}
                  disabled={!file || busy}
                  className="w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-60"
                >
                  {busy ? "Converting..." : "Start Conversion"}
                </button>

                <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-300">
                  <div>1. Upload a valid PDF.</div>
                  <div>2. Pick format and extraction mode.</div>
                  <div>3. Click convert and wait for auto-download.</div>
                </div>

                {converter.error ? (
                  <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                    {(converter.error as Error).message}
                  </div>
                ) : null}
              </Card>
            </div>
          </div>
        </Section>
      </div>

      {/* <aside className="md:col-span-1 space-y-4">
        <Card title="Status" description="PDF conversion backend is active." />
      </aside> */}
    </div>
  );
}

