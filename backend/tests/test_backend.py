"""Unit and integration tests for FastAPI backend and data transformers."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from main import _CLIENT_REQUESTS, app
from src.cleaner import clean_prodi, clean_ptn, clean_query, filter_ptns

client = TestClient(app)


def test_clean_ptn() -> None:
    raw: dict[str, object] = {
        "id_ptn": 101,
        "kode_ptn": 1001,
        "nama": " TEST UNIV ",
        "is_vokasi": 1,
        "is_akademik": 0,
        "alamat": None,
        "provinsi": [
            {
                "kode_prov1": "010000",
                "nama_prov1": "DKI Jakarta",
                "kode_kota": "-",
                "nama_kota": "Kota Jakarta Selatan",
            }
        ],
    }
    cleaned = clean_ptn(raw)
    assert cleaned["id_ptn"] == 101
    assert cleaned["kode_ptn"] == 1001
    assert cleaned["nama"] == "TEST UNIV"
    assert cleaned["type"] == "vokasi"
    assert cleaned["alamat"] == "none"


def test_clean_prodi() -> None:
    raw: dict[str, object] = {
        "id_prodi": 123,
        "nama": " Teknik Informatika ",
        "jenjang": "S1",
        "daya_tampung_snbp": 50,
        "history_daya_tampung": [
            {"tahun": 2023, "daya_tampung": 50, "peminat": 500, "terima": 50}
        ],
    }
    cleaned = clean_prodi(raw, is_snbp=True)
    assert cleaned["id_prodi"] == 123
    assert cleaned["nama"] == "Teknik Informatika"
    assert cleaned["daya_tampung"] == 50
    assert cleaned["chance_5_year"] == 10.0


def test_clean_query() -> None:
    assert clean_query("ab") == ""
    assert clean_query("a!b@") == ""
    assert clean_query("  jaw!a  ") == "jawa"
    assert clean_query("020000") == "020000"


def test_filter_ptns() -> None:
    ptns: list[dict[str, object]] = [
        {
            "id_ptn": 1,
            "nama": "Univ A",
            "provinsi": [
                {
                    "nama_prov1": "Jawa Barat",
                    "kode_prov1": "020000",
                    "nama_kota": "Kota Bandung",
                    "kode_kota": "020100",
                }
            ],
        },
        {
            "id_ptn": 2,
            "nama": "Univ B",
            "provinsi": [
                {
                    "nama_prov1": "Jawa Barat",
                    "kode_prov1": "020000",
                    "nama_kota": "Kota Bogor",
                    "kode_kota": "020200",
                }
            ],
        },
    ]
    res = filter_ptns(ptns, provinsi="JAWA BARAT!", kota="baNDuNG--")
    assert len(res) == 1
    assert res[0]["nama"] == "Univ A"

    # Short query (<3 chars) returns empty list
    assert filter_ptns(ptns, provinsi="jb") == []


def test_health_endpoint() -> None:
    _CLIENT_REQUESTS.clear()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_rate_limiter_middleware() -> None:
    _CLIENT_REQUESTS.clear()
    for _ in range(5):
        resp = client.get("/health")
        assert resp.status_code == 200

    resp = client.get("/health")
    assert resp.status_code == 429
    assert "Too many requests" in resp.json()["detail"]


@patch("src.routes.fetch_ptns", new_callable=AsyncMock)
def test_snbp_endpoint(mock_fetch: AsyncMock) -> None:
    _CLIENT_REQUESTS.clear()
    mock_fetch.return_value = [{"id_ptn": 1, "nama": "Univ Test"}]
    resp = client.get("/snbp?provinsi=Aceh")
    assert resp.status_code == 200
    assert resp.json() == [{"id_ptn": 1, "nama": "Univ Test"}]


def test_cors_headers() -> None:
    _CLIENT_REQUESTS.clear()
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


if __name__ == "__main__":
    test_clean_ptn()
    test_clean_prodi()
    test_filter_ptns()
    test_health_endpoint()
    test_rate_limiter_middleware()
    print("All unit and integration tests passed!")
