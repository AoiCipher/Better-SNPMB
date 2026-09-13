# Better SNPMB Data Explorer (B-SNPMB)

An open-source exploration platform, CLI pipeline, and REST API service for Indonesian State University Admission statistics (SNBP and SNBT).

## Overview

Better SNPMB Data Explorer (B-SNPMB) provides a high-performance backend API, standalone CLI data collector, and modern Next.js web application to analyze public Indonesian state university admission data. Users can explore capacity (*daya tampung*), applicant volume (*peminat*), competition ratios (*keketatan*), and provincial applicant distributions across state universities (PTN).

## Repository Architecture

```text
Better-SNPMB/
├── backend/
│   ├── main.py                  # FastAPI application entrypoint & rate limiting middleware
│   ├── pyproject.toml           # Python dependencies and Hatchling build configuration
│   ├── univinfo.json            # Local cached dataset for offline and fallback execution
│   ├── README.md                # Backend service documentation and architecture
│   ├── src/
│   │   ├── __init__.py           # Package initialization
│   │   ├── cleaner.py           # Data normalization, trend analysis, & metrics computation
│   │   ├── fetcher.py           # Asynchronous HTTP client with caching mechanisms
│   │   └── routes.py            # REST API endpoint handlers (/health, /snbp, /snbt)
│   └── tests/
│       └── test_backend.py      # Pytest automated test suite for backend logic
├── frontend/
│   ├── package.json             # Node.js dependencies and script definitions
│   ├── next.config.ts           # Next.js framework configuration
│   ├── tsconfig.json            # TypeScript compiler configuration
│   ├── README.md                # Web application documentation and component guide
│   ├── src/
│   │   ├── app/                 # Next.js App Router (Home, Search, PTN detail, Compare)
│   │   ├── components/          # Reusable UI components (PTN cards, tables, charts, layout)
│   │   ├── hooks/               # Custom React hooks (search state, comparison state)
│   │   ├── utils/               # Export handlers (XLSX) and text formatters
│   │   └── types/               # TypeScript interface definitions
│   └── public/                  # Static assets and favicons
├── standalone/
│   ├── main.py                  # CLI entrypoint for standalone data extraction (`snpmb-pull`)
│   ├── fetcher.py               # Async crawler for upstream proxy API endpoints
│   ├── cleaner.py               # Data sanitization and 5-year historical trend parser
│   ├── pyproject.toml           # CLI tool dependencies and script configuration
│   ├── README.md                # Standalone CLI tool documentation
│   └── tests/
│       └── test_standalone.py   # Pytest automated test suite for CLI tool
└── README.md                    # Root project documentation
```

## Subsystem Quickstart

### 1. Backend Service (FastAPI)

```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

Server endpoint: `http://localhost:8000`

### 2. Web Frontend (Next.js)

```bash
cd frontend
cp .env.example .env # Or `copy .env.example .env` on Windows
npm install
npm run dev
```

`NEXT_PUBLIC_API_BASE_URL` in `.env` defaults to `http://127.0.0.1:8000`.
Web interface: `http://localhost:3000`

### 3. Standalone CLI Scraper

```bash
cd standalone
uv sync
uv run snpmb-pull
```

Exports full dataset to `unifinfo.json`.

## API Endpoints Summary

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | API service health check | None |
| `GET` | `/snbp` | SNBP pathway university and program data | `provinsi`, `kota`, `ptn` |
| `GET` | `/snbt` | SNBT pathway university and program data | `provinsi`, `kota`, `ptn` |

## Disclaimer

Better SNPMB Data Explorer (B-SNPMB) is an independent open-source project and is **not** affiliated with, authorized, maintained, sponsored, or endorsed by SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru), BP3, or the Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia. All data is retrieved from public data endpoints for educational and research purposes only. Official university admission data must always be verified directly through the official SNPMB portal (https://snpmb.bppp.kemdikbud.go.id).
