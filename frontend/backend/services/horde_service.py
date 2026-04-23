from __future__ import annotations

import asyncio
import logging
import os
import uuid
from pathlib import Path
from typing import Any

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

HORDE_BASE_URL = "https://stablehorde.net/api/v2"
HORDE_API_KEY = "0000000000"
GENERATED_IMAGES_DIR = "generated_images"
HORDE_CLIENT_AGENT = "file-mitra:1.0.0:https://file-mitra.vercel.app"


class HordeService:
    def __init__(
        self,
        generated_dir: Path,
        *,
        request_timeout_seconds: float = 30.0,
        max_poll_seconds: float = 180.0,
        poll_interval_seconds: float = 2.0,
        max_retries: int = 3,
    ) -> None:
        self.generated_dir = generated_dir
        self.generated_dir.mkdir(parents=True, exist_ok=True)
        self.request_timeout_seconds = request_timeout_seconds
        self.max_poll_seconds = max_poll_seconds
        self.poll_interval_seconds = poll_interval_seconds
        self.max_retries = max_retries

    @classmethod
    def from_env(cls, backend_dir: str) -> "HordeService":
        request_timeout = float(os.getenv("HORDE_REQUEST_TIMEOUT_SECONDS", "30"))
        max_poll = float(os.getenv("HORDE_MAX_POLL_SECONDS", "180"))
        poll_interval = float(os.getenv("HORDE_POLL_INTERVAL_SECONDS", "2"))
        retries = int(os.getenv("HORDE_MAX_RETRIES", "3"))
        output_dir = Path(backend_dir) / GENERATED_IMAGES_DIR
        return cls(
            generated_dir=output_dir,
            request_timeout_seconds=request_timeout,
            max_poll_seconds=max_poll,
            poll_interval_seconds=poll_interval,
            max_retries=retries,
        )

    async def _request_with_retry(
        self,
        client: httpx.AsyncClient,
        method: str,
        url: str,
        *,
        headers: dict[str, str] | None = None,
        json: dict[str, Any] | None = None,
    ) -> httpx.Response:
        backoff = 1.0
        last_error: Exception | None = None
        for attempt in range(1, self.max_retries + 1):
            try:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    json=json,
                )
                if response.status_code >= 500:
                    raise httpx.HTTPStatusError(
                        f"Horde server error: {response.status_code}",
                        request=response.request,
                        response=response,
                    )
                return response
            except (httpx.RequestError, httpx.HTTPStatusError) as exc:
                last_error = exc
                logger.warning(
                    "Horde request failed (attempt %s/%s): %s",
                    attempt,
                    self.max_retries,
                    str(exc),
                )
                if attempt == self.max_retries:
                    break
                await asyncio.sleep(backoff)
                backoff *= 2

        raise HTTPException(
            status_code=502,
            detail=f"AI Horde request failed after retries: {last_error}",
        )

    @staticmethod
    def _extract_horde_error(data: dict[str, Any]) -> str | None:
        for key in ("message", "detail", "error"):
            value = data.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        return None

    async def submit_generation(self, prompt: str) -> str:
        payload = {
            "prompt": prompt,
            "params": {
                "width": 768,
                "height": 768,
                "steps": 25,
                "cfg_scale": 7,
            },
            "nsfw": False,
            "censor_nsfw": True,
            "trusted_workers": False,
        }
        headers = {
            "apikey": HORDE_API_KEY,
            "Content-Type": "application/json",
            "Client-Agent": HORDE_CLIENT_AGENT,
        }
        timeout = httpx.Timeout(self.request_timeout_seconds)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await self._request_with_retry(
                client,
                "POST",
                f"{HORDE_BASE_URL}/generate/async",
                headers=headers,
                json=payload,
            )
            try:
                data = response.json()
            except ValueError as exc:
                raise HTTPException(
                    status_code=502,
                    detail="AI Horde returned non-JSON response for generation request.",
                ) from exc

        if response.status_code >= 400:
            detail = self._extract_horde_error(data) or (
                f"AI Horde generation request failed with status {response.status_code}."
            )
            raise HTTPException(status_code=502, detail=detail)

        generation_id = data.get("id")
        if not generation_id:
            detail = self._extract_horde_error(data)
            logger.warning("Horde response missing id: %s", data)
            raise HTTPException(
                status_code=502,
                detail=detail or "AI Horde did not return a generation id.",
            )

        logger.info("Submitted Horde generation. id=%s", generation_id)
        return generation_id

    async def check_status(self, generation_id: str) -> dict[str, Any]:
        timeout = httpx.Timeout(self.request_timeout_seconds)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await self._request_with_retry(
                client,
                "GET",
                f"{HORDE_BASE_URL}/generate/check/{generation_id}",
            )
            data = response.json()
        return data

    async def wait_for_completion(self, generation_id: str) -> dict[str, Any]:
        total_wait = 0.0
        while total_wait < self.max_poll_seconds:
            status = await self.check_status(generation_id)
            done = bool(status.get("done"))
            queue_position = status.get("queue_position")
            wait_time = status.get("wait_time")
            logger.info(
                "Polling Horde status. id=%s done=%s queue_position=%s wait_time=%s",
                generation_id,
                done,
                queue_position,
                wait_time,
            )

            if done:
                return status

            await asyncio.sleep(self.poll_interval_seconds)
            total_wait += self.poll_interval_seconds

        raise HTTPException(
            status_code=504,
            detail=(
                "Generation timed out due to queue delay. "
                "Try again in a few minutes."
            ),
        )

    async def _fetch_generation_result(self, generation_id: str) -> dict[str, Any]:
        timeout = httpx.Timeout(self.request_timeout_seconds)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await self._request_with_retry(
                client,
                "GET",
                f"{HORDE_BASE_URL}/generate/status/{generation_id}",
            )
            return response.json()

    async def download_and_save_first_image(self, generation_id: str) -> str:
        result = await self._fetch_generation_result(generation_id)
        generations = result.get("generations") or []
        if not generations:
            raise HTTPException(
                status_code=502,
                detail="Generation completed but no image was returned.",
            )

        image_url = generations[0].get("img")
        if not image_url:
            raise HTTPException(
                status_code=502,
                detail="Generation completed but image URL is missing.",
            )

        timeout = httpx.Timeout(self.request_timeout_seconds)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await self._request_with_retry(client, "GET", image_url)
            image_bytes = response.content

        filename = f"{uuid.uuid4().hex}.png"
        output_path = self.generated_dir / filename
        output_path.write_bytes(image_bytes)

        logger.info("Saved generated image to %s", output_path)
        return f"{GENERATED_IMAGES_DIR}/{filename}"
