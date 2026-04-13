from __future__ import annotations

import io
import os
from typing import Literal

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import fitz
import pytesseract
from docx import Document
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from openpyxl import Workbook
from PIL import Image
from pypdf import PdfReader, PdfWriter

app = FastAPI(title="Converter Backend", version="1.0.0")


def _stream_bytes(data: bytes, filename: str, media_type: str):
    headers = {"x-filename": filename}
    return StreamingResponse(io.BytesIO(data), media_type=media_type, headers=headers)


def _safe_name(name: str, fallback: str) -> str:
    clean = (name or fallback).strip().replace("/", "_").replace("\\", "_")
    return clean or fallback


def _read_image(upload: UploadFile) -> Image.Image:
    raw = upload.file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file.")
    try:
        img = Image.open(io.BytesIO(raw))
        img.load()
        return img
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc


def _is_pdf_bytes(data: bytes) -> bool:
    return len(data) >= 4 and data[:4] == b"%PDF"


def _resize_for_ocr(img: Image.Image, max_side: int = 2000) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    scale = max_side / max(w, h)
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def _image_to_rgb(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "P", "LA"):
        return img.convert("RGB")
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def _extract_text_from_docx(raw: bytes) -> str:
    doc = Document(io.BytesIO(raw))
    parts: list[str] = []
    for p in doc.paragraphs:
        t = (p.text or "").strip()
        if t:
            parts.append(t)
    for table in doc.tables:
        for row in table.rows:
            cells = " | ".join((c.text or "").strip() for c in row.cells)
            if cells.strip():
                parts.append(cells)
    return "\n".join(parts).strip()


# Minimum chars to treat PDF as "digital" (embedded text) and skip raster OCR
_MIN_EMBEDDED_PDF_TEXT = 60

# Lightweight OCR: small Python package (pytesseract) + system Tesseract binary only.
# No PyTorch / heavy ML stacks.


def _ocr_image_pil(img: Image.Image, language: str) -> str:
    rgb = _image_to_rgb(img)
    try:
        return (pytesseract.image_to_string(rgb, lang=language) or "").strip()
    except pytesseract.TesseractNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Tesseract OCR binary is not installed. Lightweight setup: "
                "macOS: brew install tesseract  (optional langs: brew install tesseract-lang). "
                "Then restart the API. Python side stays light (only pytesseract)."
            ),
        ) from exc


@app.get("/api/health")
def health():
    return JSONResponse({"ok": True})


@app.post("/api/convert/image")
def convert_image(
    file: UploadFile = File(...),
    format: Literal["jpeg", "png", "webp", "bmp"] = Form(...),
    quality: int = Form(92),
):
    img = _read_image(file)
    out = io.BytesIO()
    target = format.upper()
    save_args: dict[str, object] = {}

    if target == "JPEG":
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        save_args["quality"] = max(20, min(100, int(quality)))
        save_args["optimize"] = True
    elif target == "WEBP":
        save_args["quality"] = max(20, min(100, int(quality)))
        save_args["method"] = 6

    img.save(out, format=target, **save_args)
    base = os.path.splitext(file.filename or "image")[0]
    filename = f"{_safe_name(base, 'image')}.{format}"
    return _stream_bytes(out.getvalue(), filename, "application/octet-stream")


@app.post("/api/compress/image")
def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(80),
    max_width: int = Form(1920),
):
    img = _read_image(file)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    width, height = img.size
    if width > max_width > 0:
        new_height = int((height * max_width) / width)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

    out = io.BytesIO()
    img.save(out, format="JPEG", quality=max(20, min(95, quality)), optimize=True)
    base = os.path.splitext(file.filename or "image")[0]
    filename = f"{_safe_name(base, 'image')}-compressed.jpg"
    return _stream_bytes(out.getvalue(), filename, "application/octet-stream")


@app.post("/api/pdf/make")
def make_pdf(
    files: list[UploadFile] = File(...),
    page_size: str = Form("a4"),
    orientation: str = Form("portrait"),
    margin: int = Form(24),
):
    if not files:
        raise HTTPException(status_code=400, detail="No images provided.")

    images: list[Image.Image] = []
    for f in files:
        img = _read_image(f)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        images.append(img)

    first, rest = images[0], images[1:]
    out = io.BytesIO()
    first.save(out, format="PDF", save_all=True, append_images=rest)
    filename = "document.pdf"
    # Keep args consumed for frontend compatibility even if not layout-applied now
    _ = page_size, orientation, margin
    return _stream_bytes(out.getvalue(), filename, "application/pdf")


@app.post("/api/pdf/merge")
def merge_pdf(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(
            status_code=400, detail="At least 2 PDF files are required."
        )

    writer = PdfWriter()
    for file in files:
        raw = file.file.read()
        if not raw:
            continue
        reader = PdfReader(io.BytesIO(raw))
        for page in reader.pages:
            writer.add_page(page)

    if len(writer.pages) == 0:
        raise HTTPException(status_code=400, detail="No valid PDF pages found.")

    out = io.BytesIO()
    writer.write(out)
    return _stream_bytes(out.getvalue(), "merged.pdf", "application/pdf")


@app.post("/api/compress/pdf")
def compress_pdf(
    file: UploadFile = File(...),
    level: Literal["low", "medium", "high"] = Form("medium"),
):
    raw = file.file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty PDF file.")

    try:
        doc = fitz.open(stream=raw, filetype="pdf")
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=400, detail="Invalid PDF file.") from exc

    # PyMuPDF built-in save optimization settings.
    deflate_images = level in ("medium", "high")
    deflate_fonts = level == "high"
    out = io.BytesIO()
    doc.save(
        out,
        garbage=4,
        deflate=True,
        deflate_images=deflate_images,
        deflate_fonts=deflate_fonts,
        clean=True,
    )
    doc.close()
    return _stream_bytes(out.getvalue(), "compressed.pdf", "application/pdf")


@app.post("/api/pdf/convert")
def convert_pdf(
    file: UploadFile = File(...),
    output: Literal["xlsx", "docx"] = Form(...),
    mode: Literal["tables", "text"] = Form("text"),
):
    raw = file.file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty PDF file.")
    try:
        doc = fitz.open(stream=raw, filetype="pdf")
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=400, detail="Invalid PDF file.") from exc

    pages_text: list[str] = []
    for page in doc:
        pages_text.append(page.get_text("text") or "")
    doc.close()

    if output == "docx":
        word = Document()
        for i, content in enumerate(pages_text, start=1):
            word.add_heading(f"Page {i}", level=2)
            word.add_paragraph(content.strip() or "(No extractable text)")
        out = io.BytesIO()
        word.save(out)
        return _stream_bytes(
            out.getvalue(),
            "converted.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Extracted"
    sheet.append(["Page", "Line", "Text"])
    for page_no, content in enumerate(pages_text, start=1):
        lines = [ln.strip() for ln in content.splitlines() if ln.strip()]
        if not lines:
            sheet.append([page_no, 1, "(No extractable text)"])
            continue
        for i, line in enumerate(lines, start=1):
            sheet.append([page_no, i, line])
    _ = mode
    out = io.BytesIO()
    workbook.save(out)
    return _stream_bytes(
        out.getvalue(),
        "converted.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.post("/api/ocr/extract")
def ocr_extract(
    file: UploadFile = File(...),
    language: str = Form("eng"),
    output: Literal["txt", "pdf", "docx"] = Form("txt"),
):
    name = (file.filename or "").lower()
    raw = file.file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file.")

    # Word (.docx): extract embedded text (no OCR — fast)
    if name.endswith(".docx"):
        try:
            extracted = _extract_text_from_docx(raw)
        except Exception as exc:  # pragma: no cover
            raise HTTPException(
                status_code=400, detail="Invalid Word (.docx) file."
            ) from exc
        if not extracted:
            extracted = "No text found in document."
        if output == "txt":
            return _stream_bytes(
                extracted.encode("utf-8"), "ocr-output.txt", "text/plain"
            )
        if output == "docx":
            doc = Document()
            doc.add_heading("Extracted Text", level=1)
            doc.add_paragraph(extracted)
            out = io.BytesIO()
            doc.save(out)
            return _stream_bytes(
                out.getvalue(),
                "extracted.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        pdf_doc = fitz.open()
        page = pdf_doc.new_page()
        rect = fitz.Rect(40, 40, 555, 802)
        page.insert_textbox(rect, extracted, fontsize=11)
        out = io.BytesIO()
        pdf_doc.save(out)
        pdf_doc.close()
        return _stream_bytes(out.getvalue(), "extracted.pdf", "application/pdf")

    text_result = ""
    images_for_ocr: list[Image.Image] = []
    pdf_truncation_note = ""

    ocr_dpi = 150
    max_ocr_pages = 15
    max_embedded_pages = 50

    if name.endswith(".pdf") or _is_pdf_bytes(raw):
        try:
            pdf = fitz.open(stream=raw, filetype="pdf")
        except Exception as exc:  # pragma: no cover
            raise HTTPException(status_code=400, detail="Invalid PDF file.") from exc
        try:
            page_count = pdf.page_count
            embed_n = min(page_count, max_embedded_pages)
            chunks: list[str] = []
            for i in range(embed_n):
                page = pdf.load_page(i)
                t = (page.get_text("text") or "").strip()
                if t:
                    chunks.append(t)
            embedded = "\n\n".join(chunks).strip()

            if len(embedded) >= _MIN_EMBEDDED_PDF_TEXT:
                text_result = embedded
                if page_count > embed_n:
                    pdf_truncation_note = f"\n\n[Note: Text from first {embed_n} of {page_count} pages only.]\n"
            else:
                for i in range(min(page_count, max_ocr_pages)):
                    page = pdf.load_page(i)
                    mat = fitz.Matrix(ocr_dpi / 72, ocr_dpi / 72)
                    pix = page.get_pixmap(matrix=mat, alpha=False)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    images_for_ocr.append(_resize_for_ocr(img))
                if page_count > max_ocr_pages:
                    pdf_truncation_note = f"\n\n[Note: Only first {max_ocr_pages} of {page_count} pages were OCR'd for speed.]\n"
        finally:
            pdf.close()
    else:
        try:
            img = Image.open(io.BytesIO(raw))
            img.load()
            images_for_ocr.append(_resize_for_ocr(_image_to_rgb(img)))
        except Exception as exc:  # pragma: no cover
            raise HTTPException(
                status_code=400,
                detail="Unsupported file. Use image (JPG/PNG/WEBP), PDF, or .docx.",
            ) from exc

    for idx, image in enumerate(images_for_ocr):
        try:
            text_result += _ocr_image_pil(image, language) + "\n"
        except HTTPException:
            raise
        except Exception as exc:  # pragma: no cover
            raise HTTPException(
                status_code=500, detail=f"OCR failed on page/slice {idx + 1}: {exc!s}"
            ) from exc

    cleaned = (
        text_result.strip() + pdf_truncation_note
    ).strip() or "No OCR text extracted."

    if output == "txt":
        return _stream_bytes(cleaned.encode("utf-8"), "ocr-output.txt", "text/plain")

    if output == "docx":
        doc = Document()
        doc.add_heading("OCR Output", level=1)
        doc.add_paragraph(cleaned)
        out = io.BytesIO()
        doc.save(out)
        return _stream_bytes(
            out.getvalue(),
            "ocr-output.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )

    pdf_doc = fitz.open()
    page = pdf_doc.new_page()
    rect = fitz.Rect(40, 40, 555, 802)
    page.insert_textbox(rect, cleaned, fontsize=11)
    out = io.BytesIO()
    pdf_doc.save(out)
    pdf_doc.close()
    return _stream_bytes(out.getvalue(), "ocr-output.pdf", "application/pdf")


# backend/main.py → parent dir is frontend app root (where package.json / dist/ live)
_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_PATH = os.environ.get("FRONTEND_DIST_PATH", os.path.join(_BASE, "dist"))
_ASSETS_DIR = os.path.join(DIST_PATH, "assets")
_INDEX_HTML = os.path.join(DIST_PATH, "index.html")

if os.path.isdir(_ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=_ASSETS_DIR), name="assets")


@app.get("/")
def serve_react():
    if not os.path.isfile(_INDEX_HTML):
        return JSONResponse(
            status_code=503,
            content={
                "detail": "Frontend build not found. Run `npm run build` in the frontend root.",
                "expected_index": _INDEX_HTML,
            },
        )
    return FileResponse(_INDEX_HTML)
