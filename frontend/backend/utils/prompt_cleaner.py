from __future__ import annotations

import re

_PHRASE_REPLACEMENTS: dict[str, str] = {
    "bana de": "create",
    "ke sath": "with",
    "ek": "a",
    "aur": "and",
    "bahut": "very",
    "high quality": "highly detailed",
    "ultra realistic": "ultra realistic",
}


def _normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _replace_hinglish_phrases(text: str) -> str:
    normalized = text.lower()
    for hinglish, english in _PHRASE_REPLACEMENTS.items():
        normalized = normalized.replace(hinglish, english)
    return normalized


def enhance_hinglish_prompt(prompt: str) -> str:
    """Convert a Hinglish input into a richer English image prompt."""
    raw = _normalize_spaces(prompt)
    if not raw:
        return ""

    translated = _replace_hinglish_phrases(raw)
    if not translated.endswith("."):
        translated = f"{translated}."

    # Add quality hints so user Hinglish prompts still generate polished images.
    return (
        "Generate a visually stunning image based on this prompt: "
        f"{translated} Cinematic lighting, highly detailed, 4k quality, trending art style."
    )
