export type ImageFormat = "jpeg" | "png" | "webp" | "bmp";

export async function convertImage(params: {
  file: File;
  format: ImageFormat;
  quality?: number;
}) {
  const form = new FormData();
  form.append("file", params.file);
  form.append("format", params.format);
  if (typeof params.quality === "number") {
    form.append("quality", String(params.quality));
  }

  const res = await fetch("/api/convert/image", {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Convert failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename =
    res.headers.get("x-filename") ||
    `${params.file.name.replace(/\.[^/.]+$/, "") || "image"}.${params.format}`;
  return { blob, filename };
}

export async function makePdf(params: {
  files: File[];
  pageSize: "a4" | "letter";
  orientation: "portrait" | "landscape";
  margin: number;
}) {
  const form = new FormData();
  for (const file of params.files) {
    form.append("files", file);
  }
  form.append("page_size", params.pageSize);
  form.append("orientation", params.orientation);
  form.append("margin", String(params.margin));

  const res = await fetch("/api/pdf/make", {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PDF creation failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename = res.headers.get("x-filename") || "document.pdf";
  return { blob, filename };
}

export async function convertPdf(params: {
  file: File;
  output: "xlsx" | "docx";
  mode: "tables" | "text";
}) {
  const form = new FormData();
  form.append("file", params.file);
  form.append("output", params.output);
  form.append("mode", params.mode);

  const res = await fetch("/api/pdf/convert", {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PDF conversion failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename = res.headers.get("x-filename") || `converted.${params.output}`;
  return { blob, filename };
}

export async function compressImage(params: {
  file: File;
  quality: number;
  maxWidth?: number;
}) {
  const form = new FormData();
  form.append("file", params.file);
  form.append("quality", String(params.quality));
  if (params.maxWidth) {
    form.append("max_width", String(params.maxWidth));
  }

  const res = await fetch("/api/compress/image", {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Image compression failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename =
    res.headers.get("x-filename") ||
    `${params.file.name.replace(/\.[^/.]+$/, "") || "compressed"}-compressed.jpg`;
  return { blob, filename };
}

export async function compressPdf(params: { file: File; level: "low" | "medium" | "high" }) {
  const form = new FormData();
  form.append("file", params.file);
  form.append("level", params.level);

  const res = await fetch("/api/compress/pdf", {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PDF compression failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename = res.headers.get("x-filename") || "compressed.pdf";
  return { blob, filename };
}

export async function mergePdf(params: { files: File[] }) {
  const form = new FormData();
  for (const file of params.files) {
    form.append("files", file);
  }

  const res = await fetch("/api/pdf/merge", {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PDF merge failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename = res.headers.get("x-filename") || "merged.pdf";
  return { blob, filename };
}

const OCR_TIMEOUT_MS = 180_000;

export async function runOcr(params: { file: File; language: string; output: "txt" | "pdf" | "docx" }) {
  const form = new FormData();
  form.append("file", params.file);
  form.append("language", params.language);
  form.append("output", params.output);

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), OCR_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/ocr/extract", {
      method: "POST",
      body: form,
      signal: controller.signal
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        `OCR timed out after ${OCR_TIMEOUT_MS / 1000}s. Try a smaller image, fewer PDF pages, or lower resolution scan.`
      );
    }
    throw e;
  } finally {
    window.clearTimeout(timeoutId);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `OCR failed (${res.status})`);
  }
  const blob = await res.blob();
  const filename = res.headers.get("x-filename") || `ocr-output.${params.output}`;
  return { blob, filename };
}

