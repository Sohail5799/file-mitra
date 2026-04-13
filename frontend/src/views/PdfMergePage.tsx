import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { mergePdf } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

export function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);

  const merger = useMutation({
    mutationFn: async () => {
      if (files.length < 2) throw new Error("Please select at least 2 PDF files.");
      return mergePdf({ files });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDF files merged successfully.");
    },
    onError: (error) => {
      void showError((error as Error).message);
    }
  });

  return (
    <Section
      title="Merge PDF"
      description="Combine multiple PDFs into one file in selected order."
      titleLevel={1}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Select PDFs">
          <input
            id="merge-pdf-input"
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          <label htmlFor="merge-pdf-input" className="btn-secondary w-full cursor-pointer">
            {files.length ? "Change PDF files" : "Choose PDF files"}
          </label>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`}>{index + 1}. {file.name}</div>
            ))}
            {!files.length ? <div>No files selected.</div> : null}
          </div>
        </Card>

        <Card title="Merge action">
          <div className="text-sm text-slate-300">
            Add files in desired order. Backend keeps this sequence while merging.
          </div>
          <button
            onClick={() => merger.mutate()}
            disabled={files.length < 2 || merger.isPending}
            className="btn-primary mt-4 disabled:opacity-60"
          >
            {merger.isPending ? "Merging..." : "Merge & Download"}
          </button>
        </Card>
      </div>
    </Section>
  );
}

