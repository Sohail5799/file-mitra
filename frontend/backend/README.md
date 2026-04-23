# Converter Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## OCR (images / scanned PDFs) — lightweight

- **Python**: only `pytesseract` (small wrapper).
- **System**: install **Tesseract** once — `brew install tesseract` (add `tesseract-lang` for Hindi/Urdu etc.).
- **Digital PDFs**: embedded text is read with PyMuPDF first (no OCR, no extra weight).

## Optional system dependencies

- **Ghostscript** — if you later want an alternate PDF compression engine.

## Run server

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Frontend Vite proxy already points `/api` to `http://127.0.0.1:8000`.

## Endpoints

- `POST /api/convert/image`
- `POST /api/compress/image`
- `POST /api/pdf/make`
- `POST /api/pdf/merge`
- `POST /api/compress/pdf`
- `POST /api/pdf/convert`
- `POST /api/ocr/extract`
- `POST /generate-image`

## Cloudflare Workers AI Image Generation

- Model used: `@cf/stabilityai/stable-diffusion-xl-base-1.0`
- Endpoint: `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`
- Saves generated images to local `generated_images/`

Required env vars:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Optional env vars:

- `IMAGE_PROVIDER=cloudflare`
- `CLOUDFLARE_TIMEOUT_SECONDS=45`

