# UnivScrap

Async scraper & FastAPI backend for Indonesian University Admission (SNPMB) SNBP and SNBT data.

## Features

- **FastAPI Backend**: Serves SNBP & SNBT data with filtering and rate limiting.
- **Async Scraper**: Concurrent data fetching using `aiohttp`.
- **Data Cleaners**: Calculates 5-year acceptance rates and cleans up university & study program data.

## Installation

Requires Python 3.10+ and [uv](https://docs.astral.sh/uv/).

```bash
uv sync
```

## Usage

### Run API Server

```bash
uv run univscrap
# or
uv run uvicorn main:app --reload
```

Server starts at `http://localhost:8000`.

### API Endpoints

- `GET /health`: Health check endpoint.
- `GET /snbp`: Fetch SNBP universities or program details.
  - Query parameters: `provinsi`, `kota`, `ptn`
- `GET /snbt`: Fetch SNBT universities or program details.
  - Query parameters: `provinsi`, `kota`, `ptn`

### Python Library Usage

```python
import asyncio
from src.fetcher import fetch_prodi, fetch_ptns

# Fetch all SNBP universities
ptns = asyncio.run(fetch_ptns(is_snbp=True))

# Fetch study programs for a specific university
prodi = asyncio.run(fetch_prodi("https://snpmb.id/proxy-prodi-sn.php?ptn=355", is_snbp=True))
```

## Testing

```bash
uv run pytest
```
