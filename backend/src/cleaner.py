"""Data transformer module for SNPMB university study program data."""

import re
from typing import Any


def _safe_int(val: Any, default: int = 0) -> int:
    """Convert input to integer safely."""
    if val is None:
        return default
    try:
        return int(str(val))
    except (ValueError, TypeError):
        return default


def _safe_str(val: Any, default: str = "none") -> str:
    """Clean string value or return default if empty/dash."""
    if val is None:
        return default
    s = str(val).strip()
    return default if s in ("", "-") else s


def clean_query(val: str | None) -> str | None:
    if val is None:
        return None
    cleaned = re.sub(r"[^a-zA-Z0-9]", "", val).lower()
    return cleaned if len(cleaned) >= 3 else ""


def clean_prodi(item: dict[str, Any], is_snbp: bool) -> dict[str, Any]:
    """Clean and standardize raw study program (prodi) dictionary."""
    dt_key = "daya_tampung_snbp" if is_snbp else "daya_tampung_snbt"

    kode_port = item.get("kode_portofolio")
    nama_port = item.get("nama_portofolio")
    if kode_port is None or str(kode_port) == "0":
        kode_port, nama_port = None, None

    history: list[dict[str, Any]] = []
    tot_accepted = tot_peminat = 0

    raw_history = item.get("history_daya_tampung")
    if isinstance(raw_history, list):
        for h in raw_history:
            if not isinstance(h, dict):
                continue
            dt = _safe_int(h.get("daya_tampung"))
            pem = _safe_int(h.get("peminat"))
            ter = h.get("terima")
            accepted = _safe_int(ter) if ter is not None else dt
            chance = round((accepted / pem * 100), 2) if pem > 0 else 0.0

            tot_accepted += accepted
            tot_peminat += pem
            history.append({
                "tahun": h.get("tahun"),
                "daya_tampung": dt,
                "peminat": pem,
                "terima": accepted,
                "chance": chance,
            })

    chance_5_year = round((tot_accepted / tot_peminat * 100), 2) if tot_peminat > 0 else 0.0

    res: dict[str, Any] = {
        "id_prodi": item.get("id_prodi"),
        "nama": str(item.get("nama", "") or "").strip(),
        "jenjang": item.get("jenjang"),
        "daya_tampung": _safe_int(item.get(dt_key)),
        "kode_portofolio": kode_port,
        "nama_portofolio": nama_port,
        "history_daya_tampung": history,
        "chance_5_year": chance_5_year,
    }

    raw_prov = item.get("history_peminat_provinsi")
    if isinstance(raw_prov, list):
        prov_map: dict[str, dict[str, int]] = {}
        for p in raw_prov:
            if isinstance(p, dict):
                prov = p.get("nama_prov")
                if isinstance(prov, str) and prov:
                    prov_map.setdefault(prov, {})[str(p.get("tahun"))] = _safe_int(p.get("jml_peminat"))
        res["history_peminat_provinsi"] = prov_map

    return res


def clean_ptn(item: dict[str, Any]) -> dict[str, Any]:
    """Clean and standardize raw PTN dictionary."""
    if str(item.get("is_ptkin")) in ("1", "True"):
        ptn_type = "ptkin"
    elif str(item.get("is_vokasi")) in ("1", "True"):
        ptn_type = "vokasi"
    else:
        ptn_type = "akademik"

    raw_prov = item.get("provinsi")
    prov_list: list[dict[str, str]] = []
    if isinstance(raw_prov, list):
        for p in raw_prov:
            if isinstance(p, dict):
                prov_list.append({
                    "kode_prov1": _safe_str(p.get("kode_prov1")),
                    "nama_prov1": _safe_str(p.get("nama_prov1")),
                    "kode_kota": _safe_str(p.get("kode_kota")),
                    "nama_kota": _safe_str(p.get("nama_kota")),
                })

    if not prov_list:
        prov_list.append({
            "kode_prov1": "none",
            "nama_prov1": "none",
            "kode_kota": "none",
            "nama_kota": "none",
        })

    alamat = item.get("alamat")
    return {
        "id_ptn": item.get("id_ptn"),
        "kode_ptn": item.get("kode_ptn"),
        "nama": str(item.get("nama", "") or "").strip(),
        "type": ptn_type,
        "alamat": str(alamat).strip() if alamat not in (None, "") else "none",
        "provinsi": prov_list,
    }


def filter_ptns(
    ptns: list[dict[str, Any]],
    provinsi: str | None = None,
    kota: str | None = None,
) -> list[dict[str, Any]]:
    """Filter list of PTNs by provinsi and optionally kota."""
    if not provinsi and not kota:
        return ptns

    prov_query = clean_query(provinsi) if provinsi is not None else None
    kota_query = clean_query(kota) if kota is not None else None

    if (provinsi is not None and not prov_query) or (kota is not None and not kota_query):
        return []

    result: list[dict[str, Any]] = []
    for ptn in ptns:
        prov_items = ptn.get("provinsi", [])
        if not isinstance(prov_items, list):
            continue

        for p in prov_items:
            if isinstance(p, dict):
                k_prov = clean_query(str(p.get("kode_prov1", ""))) or ""
                n_prov = clean_query(str(p.get("nama_prov1", ""))) or ""
                k_kota = clean_query(str(p.get("kode_kota", ""))) or ""
                n_kota = clean_query(str(p.get("nama_kota", ""))) or ""

                prov_match = prov_query is None or (prov_query in n_prov or prov_query == k_prov)
                kota_match = kota_query is None or (kota_query in n_kota or kota_query == k_kota)

                if prov_match and kota_match:
                    result.append(ptn)
                    break

    return result
