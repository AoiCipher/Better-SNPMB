"""Async fetcher module for downloading and saving study program data."""

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import cast

import aiohttp

from src.cleaner import clean_prodi, clean_ptn, filter_ptns

logger = logging.getLogger(__name__)

SNBP_URL = "https://snpmb.id/proxy-prodi-sn.php?ptn="
SNBT_URL = "https://snpmb.id/proxy-prodi-sb.php?ptn="
SNBP_PTN_URL = "https://snpmb.id/proxy-ptn-sn.php"
SNBT_PTN_URL = "https://snpmb.id/proxy-ptn-sb.php"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
}
DEFAULT_OUT = Path(__file__).resolve().parent.parent / "univinfo.json"

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


def _try_write_json(data: object, out_path: Path) -> None:
    """Attempt to write JSON data to file system, suppressing read-only errors."""
    try:
        out_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception as e:
        logger.warning("Could not write cache to %s: %s", out_path, e)


def _load_fallback_ptns(
    provinsi: str | None = None,
    kota: str | None = None,
    out_path: Path = DEFAULT_OUT,
) -> list[dict[str, object]]:
    """Load local pre-cached univinfo.json fallback data."""
    try:
        target_path = out_path if out_path.exists() else (Path(__file__).resolve().parent.parent / "univinfo.json")
        if target_path.exists():
            data = json.loads(target_path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                return filter_ptns(cast(list[dict[str, object]], data), provinsi=provinsi, kota=kota)
    except Exception as e:
        logger.error("Fallback reading %s failed: %s", out_path, e)
    return []


async def fetch_prodi(
    url: str, is_snbp: bool, out_path: Path = DEFAULT_OUT
) -> list[dict[str, object]]:
    """Fetch raw study program data from URL, clean it, and write to JSON file."""
    await _throttle_upstream()
    try:
        timeout = aiohttp.ClientTimeout(total=8.0)
        async with (
            aiohttp.ClientSession(headers=HEADERS, timeout=timeout) as session,
            session.get(url) as resp,
        ):
            if resp.status == 200:
                raw_data = cast(list[dict[str, object]], await resp.json(content_type=None))
                cleaned = [clean_prodi(item, is_snbp) for item in raw_data]
                _try_write_json(cleaned, out_path)
                return cleaned
    except Exception as e:
        logger.warning("Fetch prodi upstream failed for %s: %s", url, e)
    return []


async def fetch_ptns(
    is_snbp: bool = False,
    provinsi: str | None = None,
    kota: str | None = None,
    out_path: Path = DEFAULT_OUT,
) -> list[dict[str, object]]:
    """Fetch raw PTN data from endpoint, clean, filter, and write to JSON file with fallback."""
    await _throttle_upstream()
    url = SNBP_PTN_URL if is_snbp else SNBT_PTN_URL
    try:
        timeout = aiohttp.ClientTimeout(total=8.0)
        async with (
            aiohttp.ClientSession(headers=HEADERS, timeout=timeout) as session,
            session.get(url) as resp,
        ):
            if resp.status == 200:
                raw_data = cast(list[dict[str, object]], await resp.json(content_type=None))
                cleaned = [clean_ptn(item) for item in raw_data]
                filtered = filter_ptns(cleaned, provinsi=provinsi, kota=kota)
                if filtered or (not provinsi and not kota):
                    _try_write_json(filtered, out_path)
                    return filtered
    except Exception as e:
        logger.warning("Fetch PTNs upstream failed for %s: %s", url, e)

    return _load_fallback_ptns(provinsi=provinsi, kota=kota, out_path=out_path)
