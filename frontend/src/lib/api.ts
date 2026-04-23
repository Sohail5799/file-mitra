export type ImageFormat = "jpeg" | "png" | "webp" | "bmp";
const IMAGE_GEN_TIMEOUT_MS = 240_000;

/** Production / remote API. Empty = same origin (local Vite `/api` → proxy). */
function apiUrl(path: string): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";
  const base = raw.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

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

  const res = await fetch(apiUrl("/api/convert/image"), {
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

  const res = await fetch(apiUrl("/api/pdf/make"), {
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

  const res = await fetch(apiUrl("/api/pdf/convert"), {
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

  const res = await fetch(apiUrl("/api/compress/image"), {
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

  const res = await fetch(apiUrl("/api/compress/pdf"), {
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

  const res = await fetch(apiUrl("/api/pdf/merge"), {
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
    res = await fetch(apiUrl("/api/ocr/extract"), {
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

export async function submitContact(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch(apiUrl("/api/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let detail = text;
    try {
      const j = JSON.parse(text) as { detail?: unknown };
      if (typeof j.detail === "string") {
        detail = j.detail;
      } else if (Array.isArray(j.detail)) {
        detail = j.detail
          .map((x) =>
            typeof x === "object" && x && "msg" in x ? String((x as { msg: string }).msg) : String(x)
          )
          .join("; ");
      }
    } catch {
    }
    throw new Error(detail || `Contact failed (${res.status})`);
  }
  return (await res.json()) as { ok: boolean };
}

type GenerateImageResponse = {
  message: string;
  image_url: string;
};

function resolveImagePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return apiUrl(p);
}

export async function generateImageFromPrompt(params: {
  prompt: string;
}): Promise<{ message: string; imageUrl: string }> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), IMAGE_GEN_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(apiUrl("/generate-image"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: params.prompt }),
      signal: controller.signal
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        `Image generation timed out after ${IMAGE_GEN_TIMEOUT_MS / 1000}s. AI Horde queue busy ho sakti hai, please retry.`
      );
    }
    throw e;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Image generation failed (${res.status})`);
  }

  const data = (await res.json()) as GenerateImageResponse;
  return {
    message: data.message,
    imageUrl: resolveImagePath(data.image_url)
  };
}

