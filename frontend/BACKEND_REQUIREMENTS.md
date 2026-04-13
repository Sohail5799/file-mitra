# Python Backend Requirements

Frontend routes and UI are wired to these API endpoints:

- `POST /api/compress/image`
- `POST /api/compress/pdf`
- `POST /api/pdf/merge`
- `POST /api/ocr/extract`

Recommended Python packages for implementing these features:

- `Pillow` for image compression and resizing
- `PyMuPDF` (`fitz`) for PDF optimization and page handling
- `ghostscript` (system tool) for aggressive PDF compression profiles
- `pytesseract` (light) + **Tesseract** system binary for image / scanned-PDF OCR
- `python-docx` (if OCR output supports `.docx`)

Suggested install command:

```bash
pip install pillow pymupdf pytesseract python-docx
```

Install Tesseract on the OS for OCR (`brew install tesseract`). No PyTorch / heavy ML required.

