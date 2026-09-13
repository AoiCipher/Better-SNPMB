"""Data transformer module for SNPMB university study program data."""

import re
from typing import cast


def clean_query(val: str | None) -> str | None:
    if val is None:
        return None
    cleaned = re.sub(r"[^a-zA-Z0-9]", "", val).lower()
    return cleaned if len(cleaned) >= 3 else ""


def clean_prodi(item: dict[str, object], is_snbp: bool) -> dict[str, object]:
    """Clean and standardize raw study program (prodi) dictionary.

    Calculates acceptance chances per year, aggregate 5-year acceptance chance,
    and structures optional province history.

    Args:
        item: Raw dictionary representing a study program.
        is_snbp: Flag indicating SNBP (True) or SNBT (False) admission track.

    Returns:
        Standardized study program dictionary.
    """
    dt_key = "daya_tampung_snbp" if is_snbp else "daya_tampung_snbt"

    kode_port = item.get("kode_portofolio", 0)
    nama_port = item.get("nama_portofolio")
    if str(kode_port) == "0":
        kode_port = None
        nama_port = None

    raw_history = item.get("history_daya_tampung")
    history: list[dict[str, object]] = []
    tot_accepted = 0
    tot_peminat = 0

    if isinstance(raw_history, list):
        raw_history_list = cast(list[object], raw_history)
        for h_item in raw_history_list:
            if not isinstance(h_item, dict):
                continue
            h = cast(dict[str, object], h_item)
            tahun = h.get("tahun")
            raw_dt = h.get("daya_tampung", 0)
            dt = int(str(raw_dt if raw_dt is not None else 0))
            raw_pem = h.get("peminat", 0)
            pem = int(str(raw_pem if raw_pem is not None else 0))
            ter = h.get("terima")

            accepted = int(str(ter)) if ter is not None else dt
            chance = round((accepted / pem * 100), 2) if pem > 0 else 0.0

            tot_accepted += accepted
            tot_peminat += pem

            history.append({
                "tahun": tahun,
                "daya_tampung": dt,
                "peminat": pem,
                "terima": accepted,
                "chance": chance,
            })

    chance_5_year = round((tot_accepted / tot_peminat * 100), 2) if tot_peminat > 0 else 0.0

    raw_dt_val = item.get(dt_key, 0)
    daya_tampung_val = int(str(raw_dt_val if raw_dt_val is not None else 0))

    res: dict[str, object] = {
        "id_prodi": item.get("id_prodi"),
        "nama": str(item.get("nama", "") or "").strip(),
        "jenjang": item.get("jenjang"),
        "daya_tampung": daya_tampung_val,
        "kode_portofolio": kode_port,
        "nama_portofolio": nama_port,
        "history_daya_tampung": history,
        "chance_5_year": chance_5_year,
    }

    raw_prov = item.get("history_peminat_provinsi")
    if isinstance(raw_prov, list):
        prov_map: dict[str, dict[str, int]] = {}
        raw_prov_list = cast(list[object], raw_prov)
        for p_item in raw_prov_list:
            if isinstance(p_item, dict):
                p = cast(dict[str, object], p_item)
                prov = p.get("nama_prov")
                if isinstance(prov, str) and prov:
                    if prov not in prov_map:
                        prov_map[prov] = {}
                    raw_jml = p.get("jml_peminat", 0)
                    jml = int(str(raw_jml if raw_jml is not None else 0))
                    prov_map[prov][str(p.get("tahun"))] = jml
        res["history_peminat_provinsi"] = prov_map

    return res


def clean_ptn(item: dict[str, object]) -> dict[str, object]:
    """Clean and standardize raw PTN dictionary."""
    is_vokasi = item.get("is_vokasi")
    ptn_type = "vokasi" if str(is_vokasi) in ("1", "True") else "akademik"

    raw_prov = item.get("provinsi")
    prov_list: list[dict[str, str]] = []
    if isinstance(raw_prov, list) and raw_prov:
        raw_prov_list = cast(list[object], raw_prov)
        for p_item in raw_prov_list:
            if isinstance(p_item, dict):
                p = cast(dict[str, object], p_item)
                k_prov = p.get("kode_prov1")
                n_prov = p.get("nama_prov1")
                k_kota = p.get("kode_kota")
                n_kota = p.get("nama_kota")

                prov_list.append({
                    "kode_prov1": str(k_prov) if k_prov not in (None, "", "-") else "none",
                    "nama_prov1": str(n_prov) if n_prov not in (None, "", "-") else "none",
                    "kode_kota": str(k_kota) if k_kota not in (None, "", "-") else "none",
                    "nama_kota": str(n_kota) if n_kota not in (None, "", "-") else "none",
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
    ptns: list[dict[str, object]],
    provinsi: str | None = None,
    kota: str | None = None,
) -> list[dict[str, object]]:
    """Filter list of PTNs by provinsi and optionally kota."""
    if not provinsi and not kota:
        return ptns

    prov_query = clean_query(provinsi) if provinsi is not None else None
    kota_query = clean_query(kota) if kota is not None else None

    if (provinsi is not None and not prov_query) or (kota is not None and not kota_query):
        return []

    result: list[dict[str, object]] = []

    for ptn in ptns:
        prov_items = ptn.get("provinsi", [])
        if not isinstance(prov_items, list):
            continue

        matched = False
        prov_items_list = cast(list[object], prov_items)
        for p_item in prov_items_list:
            if isinstance(p_item, dict):
                p = cast(dict[str, object], p_item)
                k_prov = re.sub(r"[^a-zA-Z0-9]", "", str(p.get("kode_prov1", ""))).lower()
                n_prov = re.sub(r"[^a-zA-Z0-9]", "", str(p.get("nama_prov1", ""))).lower()
                k_kota = re.sub(r"[^a-zA-Z0-9]", "", str(p.get("kode_kota", ""))).lower()
                n_kota = re.sub(r"[^a-zA-Z0-9]", "", str(p.get("nama_kota", ""))).lower()

                prov_match = True if prov_query is None else (prov_query in n_prov or prov_query == k_prov)
                kota_match = True if kota_query is None else (kota_query in n_kota or kota_query == k_kota)

                if prov_match and kota_match:
                    matched = True
                    break

        if matched:
            result.append(ptn)

    return result
