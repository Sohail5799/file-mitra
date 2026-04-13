import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { compressImage, convertImage, type ImageFormat } from "../lib/api";
import { downloadBlob } from "../lib/download";
import { showError, showSuccess } from "../lib/alerts";

export function ImageToolsPage() {
  const [convertFile, setConvertFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [quality, setQuality] = useState(88);

  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [compressQuality, setCompressQuality] = useState(80);

  const converter = useMutation({
    mutationFn: async () => {
      if (!convertFile) throw new Error("Choose image for convert.");
      return convertImage({ file: convertFile, format, quality });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("Image converted.");
    },
    onError: (error) => void showError((error as Error).message)
  });

  const compressor = useMutation({
    mutationFn: async () => {
      if (!compressFile) throw new Error("Choose image for compress.");
      return compressImage({ file: compressFile, quality: compressQuality, maxWidth: 1920 });
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob({ blob, filename });
      void showSuccess("Image compressed.");
    },
    onError: (error) => void showError((error as Error).message)
  });

  return (
    <Section
      title="Image Tools"
      description="Convert and compress images in one simple place."
      titleLevel={1}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Image Convert">
          <input
            id="image-tools-convert-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setConvertFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="image-tools-convert-input" className="btn-secondary w-full cursor-pointer">
            {convertFile ? "Change Image" : "Choose Image"}
          </label>
          <div className="mt-2 text-xs text-slate-400">{convertFile?.name || "JPG/PNG/WEBP/BMP"}</div>

          <div className="mt-3">
            <label className="text-xs text-slate-400">Output format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as ImageFormat)} className="select mt-2 w-full">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="bmp">BMP</option>
            </select>
          </div>

          <button
            onClick={() => converter.mutate()}
            disabled={!convertFile || converter.isPending}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {converter.isPending ? "Converting..." : "Convert & Download"}
          </button>
        </Card>

        <Card title="Image Compress">
          <input
            id="image-tools-compress-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setCompressFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="image-tools-compress-input" className="btn-secondary w-full cursor-pointer">
            {compressFile ? "Change Image" : "Choose Image"}
          </label>
          <div className="mt-2 text-xs text-slate-400">{compressFile?.name || "Best for JPG/PNG"}</div>

          <div className="mt-3">
            <label className="text-xs text-slate-400">Quality: {compressQuality}%</label>
            <input
              className="mt-2 w-full accent-white"
              type="range"
              min={30}
              max={95}
              value={compressQuality}
              onChange={(e) => setCompressQuality(Number(e.target.value))}
            />
          </div>

          <button
            onClick={() => compressor.mutate()}
            disabled={!compressFile || compressor.isPending}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {compressor.isPending ? "Compressing..." : "Compress & Download"}
          </button>
        </Card>
      </div>
    </Section>
  );
}

