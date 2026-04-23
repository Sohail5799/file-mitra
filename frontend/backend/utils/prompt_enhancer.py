from __future__ import annotations

import re

_PHRASE_MAP: dict[str, str] = {
    "bana de": "create",
    "ke sath": "with",
    "ek": "a",
    "aur": "and",
    "bahut": "very",
    "accha": "beautiful",
    "mast": "stylish",
}


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _basic_hinglish_to_english(text: str) -> str:
    output = text.lower()
    for src, target in _PHRASE_MAP.items():
        output = output.replace(src, target)
    return output


def enhance_prompt(prompt: str) -> str:
    base = _normalize(prompt)
    if not base:
        return ""

    translated = _basic_hinglish_to_english(base)
    if not translated.endswith("."):
        translated = f"{translated}."

    return (
        "High quality cinematic digital artwork. "
        f"{translated} Detailed composition, sharp focus, dramatic lighting, ultra-detailed textures."
    )
