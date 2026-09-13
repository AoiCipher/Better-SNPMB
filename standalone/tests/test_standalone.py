"""Unit tests for standalone SNPMB cleaner and fetcher modules."""

from pathlib import Path
from unittest.mock import AsyncMock, patch
import pytest

from cleaner import clean_prodi, clean_ptn, clean_query, filter_ptns
from fetcher import fetch_prodi, fetch_ptns, pull_all_data


def test_clean_query():
    assert clean_query("Jakarta!") == "jakarta"
    assert clean_query("ab") == ""
    assert clean_query(None) is None


def test_clean_prodi():
    raw_item = {
        "id_prodi": 101,
        "nama": " TEKNIK INFORMATIKA ",
        "jenjang": "S1",
        "daya_tampung_snbp": 50,
        "kode_portofolio": 0,
        "history_daya_tampung": [
            {"tahun": 2023, "daya_tampung": 40, "peminat": 200, "terima": 40},
            {"tahun": 2024, "daya_tampung": 50, "peminat": 250, "terima": 50},
        ],
    }
    cleaned = clean_prodi(raw_item, is_snbp=True)
    assert cleaned["id_prodi"] == 101
    assert cleaned["nama"] == "TEKNIK INFORMATIKA"
    assert cleaned["daya_tampung"] == 50
    assert cleaned["kode_portofolio"] is None
    assert cleaned["chance_5_year"] == 20.0  # 90 terima / 450 peminat = 20%


def test_clean_ptn():
    raw_ptn = {
        "id_ptn": 12,
        "kode_ptn": "121",
        "nama": " UNIVERSITAS INDONESIA ",
        "is_vokasi": 0,
        "alamat": "Depok",
        "provinsi": [{"kode_prov1": "31", "nama_prov1": "DKI Jakarta", "kode_kota": "3171", "nama_kota": "Jakarta Pusat"}],
    }
    cleaned = clean_ptn(raw_ptn)
    assert cleaned["id_ptn"] == 12
    assert cleaned["nama"] == "UNIVERSITAS INDONESIA"
    assert cleaned["type"] == "akademik"
    assert cleaned["alamat"] == "Depok"

    raw_ptkin = {
        "id_ptn": 13,
        "kode_ptn": "122",
        "nama": "UIN JAKARTA",
        "is_akademik": 1,
        "is_ptkin": 1,
        "is_ptnbh": 0,
        "is_vokasi": 0,
    }
    assert clean_ptn(raw_ptkin)["type"] == "ptkin"


def test_filter_ptns():
    ptns = [
        {"provinsi": [{"kode_prov1": "31", "nama_prov1": "DKI Jakarta", "kode_kota": "3171", "nama_kota": "Jakarta Pusat"}]},
        {"provinsi": [{"kode_prov1": "32", "nama_prov1": "Jawa Barat", "kode_kota": "3273", "nama_kota": "Bandung"}]},
    ]
    filtered = filter_ptns(ptns, provinsi="Jakarta")
    assert len(filtered) == 1
    assert filtered[0]["provinsi"][0]["nama_prov1"] == "DKI Jakarta"


@pytest.mark.asyncio
async def test_pull_all_data(tmp_path: Path):
    out_file = tmp_path / "unifinfo.json"

    dummy_snbp_ptns = [{"id_ptn": 1, "kode_ptn": "101", "nama": "PTN 1", "type": "akademik", "alamat": "none", "provinsi": []}]
    dummy_snbt_ptns = []
    dummy_prodis = [{"id_prodi": 1001, "nama": "Informatika", "jenjang": "S1", "daya_tampung": 30, "kode_portofolio": None, "nama_portofolio": None, "history_daya_tampung": [], "chance_5_year": 0.0}]

    with (
        patch("fetcher.fetch_ptns", side_effect=[dummy_snbp_ptns, dummy_snbt_ptns]),
        patch("fetcher.fetch_prodi", return_value=dummy_prodis),
    ):
        result = await pull_all_data(out_path=out_file)

    assert len(result) == 2  # 1 SNBP call + 1 SNBT call
    assert out_file.exists()
