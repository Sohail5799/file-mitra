import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { compressImage } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

export function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);

  const compressor = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please choose an image.");
      return compressImage({ file, quality, maxWidth });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("Image compressed and downloaded.");
    },
    onError: (error) => {
      void showError((error as Error).message);
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <Section
          title="Image Compressor"
          description="Compress images online with quality control."
          titleLevel={1}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Upload image">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-compress-input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="image-compress-input"
                className="btn-secondary w-full cursor-pointer"
              >
                {file ? "Change Image" : "Choose Image"}
              </label>
              <div className="mt-2 text-xs text-slate-400">
                {file?.name || "Supports JPG, PNG, WEBP"}
              </div>
            </Card>

            <Card title="Compression settings">
              <label className="text-xs text-slate-400">
                Quality: {quality}%
              </label>
              <input
                className="mt-2 w-full accent-white"
                type="range"
                min={25}
                max={95}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />

              {/* <label className="mt-4 block text-xs text-slate-400">Max width (px)</label>
              <input
                className="input mt-2"
                type="number"
                min={320}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
              /> */}
            </Card>
          </div>

          <div className="mt-4">
            <button
              onClick={() => compressor.mutate()}
              disabled={!file || compressor.isPending}
              className="btn-primary disabled:opacity-60"
            >
              {compressor.isPending ? "Compressing..." : "Download"}
            </button>
          </div>
        </Section>
      </div>

      <aside className="space-y-4 md:col-span-1">
        <Card title="Features">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Multi-format support</li>
            <li>High quality conversion</li>
            <li>Fast processing</li>
            <li>No watermark output</li>
            <li>Instant download</li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}
