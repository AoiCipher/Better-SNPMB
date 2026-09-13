"""Async fetcher module for downloading and saving study program data."""

import asyncio
import json
import time
from pathlib import Path
from typing import cast

import aiohttp

from src.cleaner import clean_prodi, clean_ptn, filter_ptns

SNBP_URL = "https://snpmb.id/proxy-prodi-sn.php?ptn="
SNBT_URL = "https://snpmb.id/proxy-prodi-sb.php?ptn="
SNBP_PTN_URL = "https://snpmb.id/proxy-ptn-sn.php"
SNBT_PTN_URL = "https://snpmb.id/proxy-ptn-sb.php"

HEADERS = {"User-Agent": "Mozilla/5.0"}
DEFAULT_OUT = Path("univinfo.json")

_req_lock = asyncio.Lock()
_last_req_time = 0.0


async def _throttle_upstream() -> None:
    """Ensure at most 1 request per second is made to upstream endpoints."""
    global _last_req_time
    async with _req_lock:
        now = time.monotonic()
        elapsed = now - _last_req_time
        if elapsed < 1.0:
            await asyncio.sleep(1.0 - elapsed)
        _last_req_time = time.monotonic()


async def fetch_prodi(
    url: str, is_snbp: bool, out_path: Path = DEFAULT_OUT
) -> list[dict[str, object]]:
    """Fetch raw study program data from URL, clean it, and write to JSON file."""
    await _throttle_upstream()
    try:
        async with (
            aiohttp.ClientSession(headers=HEADERS) as session,
            session.get(url) as resp,
        ):
            if resp.status != 200:
                return []
            raw_data = cast(list[dict[str, object]], await resp.json(content_type=None))
            cleaned = [clean_prodi(item, is_snbp) for item in raw_data]
            _ = out_path.write_text(json.dumps(cleaned, indent=2), encoding="utf-8")
            return cleaned
    except Exception:  # noqa: BLE001
        return []


async def fetch_ptns(
    is_snbp: bool = False,
    provinsi: str | None = None,
    kota: str | None = None,
    out_path: Path = DEFAULT_OUT,
) -> list[dict[str, object]]:
    """Fetch raw PTN data from endpoint, clean, filter, and write to JSON file."""
    await _throttle_upstream()
    url = SNBP_PTN_URL if is_snbp else SNBT_PTN_URL
    try:
        async with (
            aiohttp.ClientSession(headers=HEADERS) as session,
            session.get(url) as resp,
        ):
            if resp.status != 200:
                return []
            raw_data = cast(list[dict[str, object]], await resp.json(content_type=None))
            cleaned = [clean_ptn(item) for item in raw_data]
            filtered = filter_ptns(cleaned, provinsi=provinsi, kota=kota)
            _ = out_path.write_text(json.dumps(filtered, indent=2), encoding="utf-8")
            return filtered
    except Exception:  # noqa: BLE001
        return []
