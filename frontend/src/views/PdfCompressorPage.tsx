import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { compressPdf } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

type Level = "low" | "medium" | "high";

export function PdfCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");

  const compressor = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please choose a PDF file.");
      return compressPdf({ file, level });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDF compressed successfully.");
    },
    onError: (error) => {
      void showError((error as Error).message);
    }
  });

  return (
    <Section title="PDF Compressor" description="Compress PDF using PyMuPDF/Ghostscript powered backend.">
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Upload PDF">
          <input
            id="pdf-compress-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="pdf-compress-input" className="btn-secondary w-full cursor-pointer">
            {file ? "Change PDF" : "Choose PDF"}
          </label>
          <div className="mt-2 text-xs text-slate-400">{file?.name || "Scanned or text PDF supported"}</div>
        </Card>

        <Card title="Compression level">
          <div className="flex flex-wrap gap-2">
            {(["low", "medium", "high"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setLevel(value)}
                className={
                  value === level
                    ? "rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                    : "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                }
              >
                {value[0].toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => compressor.mutate()}
            disabled={!file || compressor.isPending}
            className="btn-primary mt-4 disabled:opacity-60"
          >
            {compressor.isPending ? "Compressing..." : "Compress & Download"}
          </button>
        </Card>
      </div>
    </Section>
  );
}

