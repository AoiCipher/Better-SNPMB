# Better SNPMB Data Explorer — Backend (B-SNPMB Backend)

FastAPI REST service and asynchronous scraper engine for Indonesian State University Admission (SNBP and SNBT) datasets.

## File Tree & Architecture

```text
backend/
├── main.py                   # FastAPI app entrypoint, middleware, and CORS configuration
├── pyproject.toml            # Project dependencies, build config, and script entrypoints
├── univinfo.json             # Pre-cached university metadata (names, locations, codes)
├── README.md                 # Backend documentation and file structure
├── src/
│   ├── __init__.py           # Package initialization
│   ├── cleaner.py            # Data transformations, 5-year statistics, & schema normalization
│   ├── fetcher.py            # Async HTTP client (aiohttp) with memory/disk caching
│   └── routes.py             # API route handlers (/health, /snbp, /snbt)
└── tests/
    └── test_backend.py       # Pytest unit and integration test suite
```

### Module Descriptions

- **`main.py`**: Initializes the FastAPI application for Better SNPMB Data Explorer API (`title="Better SNPMB Data Explorer API"`), configures CORS middleware, and enforces client IP rate limiting (5 requests per second).
- **`src/fetcher.py`**: Implements asynchronous HTTP requests to official/proxy SNPMB data endpoints. Features concurrent fetching and local JSON caching.
- **`src/cleaner.py`**: Cleans raw JSON responses, normalizes field names, calculates acceptance rates, 5-year historical trends, and provincial statistics.
- **`src/routes.py`**: Defines RESTful endpoints supporting filtering by province (`provinsi`), city (`kota`), and university code (`ptn`).
- **`tests/test_backend.py`**: Automated test suite for health checks, route parameters, rate limiter behavior, and data cleaning routines.

## Installation & Setup

### Prerequisites

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager

### Running the Server

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

The API server runs at `http://localhost:8000`. OpenAPI documentation is available at `http://localhost:8000/docs`.

### Running Tests

```bash
uv run pytest
```

## API Endpoints Reference

| Method | Route | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status | None |
| `GET` | `/snbp` | SNBP pathway university data | `provinsi`, `kota`, `ptn` |
| `GET` | `/snbt` | SNBT pathway university data | `provinsi`, `kota`, `ptn` |

## Disclaimer

Better SNPMB Data Explorer (B-SNPMB) is an independent open-source project and is **not** affiliated with, authorized, maintained, sponsored, or endorsed by SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru), BP3, or the Ministry of Education, Culture, Research, and Technology of Indonesia. All data is fetched from public endpoints for exploratory and educational purposes only. Always verify official admission statistics at the [official SNPMB portal](https://snpmb.id).
