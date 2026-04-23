from __future__ import annotations

import base64
import logging
import os
from pathlib import Path
from typing import Any, Protocol

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

GENERATED_IMAGES_DIR = "generated_images"
GEMINI_MODEL = "gemini-2.5-flash-image"


class ImageGenerationProvider(Protocol):
    async def generate_image(self, prompt: str) -> bytes: ...


class GeminiImageProvider:
    def __init__(
        self,
        *,
        api_key: str,
        request_timeout_seconds: float = 45.0,
    ) -> None:
        self.api_key = api_key
        self.request_timeout_seconds = request_timeout_seconds
        self.endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
        )

    def _extract_image_bytes(self, data: dict[str, Any]) -> bytes:
        candidates = data.get("candidates")
        if not isinstance(candidates, list):
            raise HTTPException(status_code=502, detail="Gemini response missing candidates.")

        for candidate in candidates:
            content = candidate.get("content") if isinstance(candidate, dict) else None
            parts = content.get("parts") if isinstance(content, dict) else None
            if not isinstance(parts, list):
                continue
            for part in parts:
                if not isinstance(part, dict):
                    continue
                inline_data = part.get("inline_data")
                if not isinstance(inline_data, dict):
                    continue
                encoded = inline_data.get("data")
                if isinstance(encoded, str) and encoded:
                    try:
                        return base64.b64decode(encoded)
                    except Exception as exc:
                        raise HTTPException(
                            status_code=502,
                            detail="Gemini returned invalid image data.",
                        ) from exc

        raise HTTPException(status_code=502, detail="Gemini did not return any generated image.")

    async def generate_image(self, prompt: str) -> bytes:
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"],
            },
        }
        params = {"key": self.api_key}
        timeout = httpx.Timeout(self.request_timeout_seconds)

        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.post(
                    self.endpoint,
                    params=params,
                    headers={"Content-Type": "application/json"},
                    json=payload,
                )
            except httpx.TimeoutException as exc:
                raise HTTPException(
                    status_code=504,
                    detail="Gemini image generation timed out. Please retry.",
                ) from exc
            except httpx.RequestError as exc:
                raise HTTPException(
                    status_code=502,
                    detail=f"Gemini request failed: {exc!s}",
                ) from exc

        try:
            data = response.json()
        except ValueError as exc:
            raise HTTPException(
                status_code=502,
                detail="Gemini returned non-JSON response.",
            ) from exc

        if response.status_code >= 400:
            detail = f"Gemini API error ({response.status_code})"
            err = data.get("error")
            if isinstance(err, dict) and isinstance(err.get("message"), str):
                detail = err["message"]
            raise HTTPException(status_code=502, detail=detail)

        return self._extract_image_bytes(data)


def build_image_provider() -> ImageGenerationProvider:
    api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("Missing GEMINI_API_KEY.")
    timeout_seconds = float(os.getenv("GEMINI_TIMEOUT_SECONDS", "45"))
    return GeminiImageProvider(
        api_key=api_key,
        request_timeout_seconds=timeout_seconds,
    )


def ensure_generated_images_dir(backend_dir: str) -> Path:
    output_dir = Path(backend_dir) / GENERATED_IMAGES_DIR
    output_dir.mkdir(parents=True, exist_ok=True)
    logger.info("Generated image directory ready at %s", output_dir)
    return output_dir
