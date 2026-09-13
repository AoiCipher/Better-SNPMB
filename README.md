# Better-SNPMB

Async scraper and FastAPI backend for Indonesian University Admission (SNPMB) SNBP & SNBT data.

## 🚀 Features

- **FastAPI Service**: REST API endpoints for SNBP and SNBT university/study program data.
- **Async Scraper**: Fetches data from SNPMB proxy endpoints using `aiohttp`.
- **Data Cleaner**: Normalizes schemas, calculates yearly acceptance chances and 5-year aggregate acceptance rates.
- **Rate Limiting**: Built-in rate limiter middleware for API security and upstream protection.

## 📂 Project Structure

```
Better-SNPMB/
├── backend/
│   ├── main.py          # FastAPI application & entrypoint
│   ├── pyproject.toml   # Project metadata & dependencies
│   ├── src/
│   │   ├── cleaner.py   # Data transformers & filters
│   │   ├── fetcher.py   # Async HTTP client & cache saver
│   │   └── routes.py    # API route handlers
│   └── tests/
│       └── test_backend.py # Pytest test suite
└── README.md
```

## 🛠️ Setup & Running

### Requirements
- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager

### Installation

```bash
cd backend
uv sync
```

### Run API Server

```bash
cd backend
uv run python main.py
# or
uv run uvicorn main:app --reload
```

The API server will run at `http://localhost:8000`.

### Running Tests

```bash
cd backend
uv run pytest
```

## 📡 API Endpoints

- `GET /health` - Service health status.
- `GET /snbp` - List SNBP universities or detailed study program data.
  - Query Params: `provinsi`, `kota`, `ptn`
- `GET /snbt` - List SNBT universities or detailed study program data.
  - Query Params: `provinsi`, `kota`, `ptn`
