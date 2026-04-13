# Converter (React + FastAPI)

## What it does
- Upload any image → converts to **JPEG** on FastAPI → browser **auto-downloads** the result.

## Run backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Run frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Frontend proxies API calls to `http://127.0.0.1:8000` via Vite `/api/*` proxy.

