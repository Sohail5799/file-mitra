import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { runOcr } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

type OcrOutput = "txt" | "pdf" | "docx";

export function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("eng");
  const [output, setOutput] = useState<OcrOutput>("txt");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const extractor = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please choose image or PDF for OCR.");
      return runOcr({ file, language, output });
    },
    onSuccess: async ({ blob, filename }) => {
      if (output === "txt") {
        const text = await blob.text();
        setExtractedText(text || "No text extracted.");
        setIsPreviewOpen(true);
        void showSuccess("OCR text ready.");
        return;
      }
      downloadBlob({ blob, filename });
      void showSuccess("OCR finished. File downloaded.");
    },
    onError: (error) => {
      void showError((error as Error).message);
    }
  });

  async function copyText() {
    try {
      await navigator.clipboard.writeText(extractedText);
      void showSuccess("Text copied.");
    } catch {
      void showError("Copy failed.");
    }
  }

  function downloadText() {
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    downloadBlob({ blob, filename: "ocr-output.txt" });
    void showSuccess("Text downloaded.");
  }

  return (
    <>
      <Section title="OCR Extractor" description="Extract text from image/PDF using OCR backend.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Upload source">
            <input
              id="ocr-input"
              type="file"
              accept="image/*,.pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="ocr-input" className="btn-secondary w-full cursor-pointer">
              {file ? "Change source file" : "Choose image/PDF"}
            </label>
            <div className="mt-2 text-xs text-slate-400">
              {file?.name || "JPG, PNG, PDF (first 15 pages), or .docx (text extract, no OCR)"}
            </div>
          </Card>

          <Card title="OCR settings">
            <label className="text-xs text-slate-400">Language code</label>
            <input
              className="input mt-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="eng / hin / urd ..."
            />

            <label className="mt-4 block text-xs text-slate-400">Output</label>
            <select
              value={output}
              onChange={(e) => setOutput(e.target.value as OcrOutput)}
              className="select mt-2 w-full"
            >
              <option value="txt">Text (.txt)</option>
              <option value="pdf">Searchable PDF (.pdf)</option>
              <option value="docx">Word (.docx)</option>
            </select>

            <button
              onClick={() => extractor.mutate()}
              disabled={!file || extractor.isPending}
              className="btn-primary mt-4 disabled:opacity-60"
            >
              {extractor.isPending ? "Processing OCR..." : output === "txt" ? "Run OCR & Show Text" : "Run OCR & Download"}
            </button>
          </Card>
        </div>
      </Section>

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="surface w-full max-w-3xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>

            <div className="mt-4 max-h-[55vh] overflow-auto rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-200 whitespace-pre-wrap">
              {extractedText || "No text extracted."}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button onClick={copyText} className="btn-secondary w-full">
                Copy
              </button>
              <button onClick={downloadText} className="btn-primary w-full">
                Download
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

