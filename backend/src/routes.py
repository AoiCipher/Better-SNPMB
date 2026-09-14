"""API routes for university admission data endpoints."""

from typing import Annotated, Any

from fastapi import APIRouter, Query

from src.cleaner import clean_query
from src.fetcher import SNBP_URL, SNBT_URL, fetch_prodi, fetch_ptns

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/snbp")
async def get_snbp(
    provinsi: Annotated[str | None, Query(max_length=100)] = None,
    kota: Annotated[str | None, Query(max_length=100)] = None,
    ptn: Annotated[str | None, Query(max_length=100)] = None,
) -> list[dict[str, Any]]:
    if ptn is not None:
        c_ptn = clean_query(str(ptn))
        if not c_ptn:
            return []
        return await fetch_prodi(f"{SNBP_URL}{c_ptn}", is_snbp=True)
    return await fetch_ptns(is_snbp=True, provinsi=provinsi, kota=kota)


@router.get("/snbt")
async def get_snbt(
    provinsi: Annotated[str | None, Query(max_length=100)] = None,
    kota: Annotated[str | None, Query(max_length=100)] = None,
    ptn: Annotated[str | None, Query(max_length=100)] = None,
) -> list[dict[str, Any]]:
    if ptn is not None:
        c_ptn = clean_query(str(ptn))
        if not c_ptn:
            return []
        return await fetch_prodi(f"{SNBT_URL}{c_ptn}", is_snbp=False)
    return await fetch_ptns(is_snbp=False, provinsi=provinsi, kota=kota)
