from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Protocol

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

GENERATED_IMAGES_DIR = "generated_images"
CF_MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0"


class ImageGenerationProvider(Protocol):
    async def generate_image(self, prompt: str) -> bytes: ...


class CloudflareAIProvider:
    def __init__(
        self,
        *,
        account_id: str,
        api_token: str,
        request_timeout_seconds: float = 45.0,
    ) -> None:
        self.account_id = account_id
        self.api_token = api_token
        self.request_timeout_seconds = request_timeout_seconds
        self.endpoint = (
            f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/{CF_MODEL}"
        )

    async def generate_image(self, prompt: str) -> bytes:
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        }
        timeout = httpx.Timeout(self.request_timeout_seconds)

        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.post(
                    self.endpoint,
                    headers=headers,
                    json={"prompt": prompt},
                )
            except httpx.TimeoutException as exc:
                raise HTTPException(
                    status_code=504,
                    detail="Cloudflare AI timed out. Please try again.",
                ) from exc
            except httpx.RequestError as exc:
                raise HTTPException(
                    status_code=502,
                    detail=f"Cloudflare AI request failed: {exc!s}",
                ) from exc

        content_type = (response.headers.get("content-type") or "").lower()
        if response.status_code >= 400:
            detail = f"Cloudflare AI error ({response.status_code})"
            try:
                payload = response.json()
                if isinstance(payload, dict):
                    errors = payload.get("errors")
                    if isinstance(errors, list) and errors:
                        first = errors[0]
                        if isinstance(first, dict):
                            detail = str(first.get("message") or detail)
                    elif isinstance(payload.get("result"), dict):
                        detail = str(payload["result"].get("error") or detail)
            except ValueError:
                pass
            raise HTTPException(status_code=502, detail=detail)

        if "image" not in content_type and "octet-stream" not in content_type:
            raise HTTPException(
                status_code=502,
                detail="Cloudflare AI returned unexpected response type.",
            )

        if not response.content:
            raise HTTPException(
                status_code=502,
                detail="Cloudflare AI returned an empty image response.",
            )
        return response.content


def build_image_provider() -> ImageGenerationProvider:
    provider = (os.getenv("IMAGE_PROVIDER", "cloudflare") or "cloudflare").strip().lower()
    if provider != "cloudflare":
        raise RuntimeError(
            "Unsupported IMAGE_PROVIDER. Currently supported: cloudflare"
        )

    account_id = (os.getenv("CLOUDFLARE_ACCOUNT_ID") or "").strip()
    api_token = (os.getenv("CLOUDFLARE_API_TOKEN") or "").strip()
    if not account_id or not api_token:
        raise RuntimeError(
            "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN."
        )

    timeout_seconds = float(os.getenv("CLOUDFLARE_TIMEOUT_SECONDS", "45"))
    return CloudflareAIProvider(
        account_id=account_id,
        api_token=api_token,
        request_timeout_seconds=timeout_seconds,
    )


def ensure_generated_images_dir(backend_dir: str) -> Path:
    output_dir = Path(backend_dir) / GENERATED_IMAGES_DIR
    output_dir.mkdir(parents=True, exist_ok=True)
    logger.info("Generated image directory ready at %s", output_dir)
    return output_dir
