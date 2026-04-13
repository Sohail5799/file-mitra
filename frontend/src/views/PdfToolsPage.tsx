import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { compressPdf, convertPdf, mergePdf } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

type Output = "xlsx" | "docx";
type Mode = "tables" | "text";
type Level = "low" | "medium" | "high";

export function PdfToolsPage() {
  const [convertFile, setConvertFile] = useState<File | null>(null);
  const [output, setOutput] = useState<Output>("xlsx");
  const [mode, setMode] = useState<Mode>("tables");

  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  const convertMutation = useMutation({
    mutationFn: async () => {
      if (!convertFile) throw new Error("Choose PDF for convert.");
      return convertPdf({ file: convertFile, output, mode });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDF converted.");
    },
    onError: (error) => void showError((error as Error).message)
  });

  const compressMutation = useMutation({
    mutationFn: async () => {
      if (!compressFile) throw new Error("Choose PDF for compress.");
      return compressPdf({ file: compressFile, level });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDF compressed.");
    },
    onError: (error) => void showError((error as Error).message)
  });

  const mergeMutation = useMutation({
    mutationFn: async () => {
      if (mergeFiles.length < 2) throw new Error("Choose at least 2 PDF files for merge.");
      return mergePdf({ files: mergeFiles });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("PDFs merged.");
    },
    onError: (error) => void showError((error as Error).message)
  });

  return (
    <Section title="PDF Tools" description="Convert, compress, and merge PDFs in one place.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="PDF Convert">
          <input
            id="pdf-tools-convert-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setConvertFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="pdf-tools-convert-input" className="btn-secondary w-full cursor-pointer">
            {convertFile ? "Change PDF" : "Choose PDF"}
          </label>
          <div className="mt-2 text-xs text-slate-400">{convertFile?.name || "PDF to Word/Excel"}</div>

          <div className="mt-3 grid gap-2">
            <select value={output} onChange={(e) => setOutput(e.target.value as Output)} className="select w-full">
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="docx">Word (.docx)</option>
            </select>
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="select w-full">
              <option value="tables">Tables</option>
              <option value="text">Text</option>
            </select>
          </div>

          <button
            onClick={() => convertMutation.mutate()}
            disabled={!convertFile || convertMutation.isPending}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {convertMutation.isPending ? "Converting..." : "Convert & Download"}
          </button>
        </Card>

        <Card title="PDF Compress">
          <input
            id="pdf-tools-compress-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setCompressFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="pdf-tools-compress-input" className="btn-secondary w-full cursor-pointer">
            {compressFile ? "Change PDF" : "Choose PDF"}
          </label>
          <div className="mt-2 text-xs text-slate-400">{compressFile?.name || "Reduce file size quickly"}</div>

          <div className="mt-3">
            <label className="text-xs text-slate-400">Compression level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="select mt-2 w-full">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={() => compressMutation.mutate()}
            disabled={!compressFile || compressMutation.isPending}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {compressMutation.isPending ? "Compressing..." : "Compress & Download"}
          </button>
        </Card>

        <Card title="Merge PDF">
          <input
            id="pdf-tools-merge-input"
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setMergeFiles(Array.from(e.target.files || []))}
          />
          <label htmlFor="pdf-tools-merge-input" className="btn-secondary w-full cursor-pointer">
            {mergeFiles.length ? "Change Files" : "Choose PDFs"}
          </label>
          <div className="mt-2 text-xs text-slate-400">
            {mergeFiles.length ? `${mergeFiles.length} files selected` : "Select at least 2 files"}
          </div>

          <div className="mt-3 max-h-28 space-y-1 overflow-auto text-xs text-slate-300">
            {mergeFiles.map((f, i) => (
              <div key={`${f.name}-${i}`}>{i + 1}. {f.name}</div>
            ))}
          </div>

          <button
            onClick={() => mergeMutation.mutate()}
            disabled={mergeFiles.length < 2 || mergeMutation.isPending}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {mergeMutation.isPending ? "Merging..." : "Merge & Download"}
          </button>
        </Card>
      </div>
    </Section>
  );
}

