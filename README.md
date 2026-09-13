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
│   └── src/                     # Scraper, cleaner, and route modules
├── frontend/
│   ├── package.json             # Node.js dependencies and script definitions
│   ├── next.config.ts           # Next.js framework configuration
│   ├── .env.example             # Frontend environment variables template
│   └── src/                     # Next.js App Router and UI components
├── standalone/                  # Standalone CLI tool
├── .github/workflows/
│   └── release.yml              # GitHub Actions CI/CD for auto releases & Docker push
├── Dockerfile                   # Single unified container build (Backend + Frontend)
├── docker-compose.yml           # Compose stack exposing ports 8000 & 3000
└── README.md                    # Root project documentation
```

## Docker Quickstart (Unified 2-System Container)

Run both Backend (FastAPI, port `8000`) and Frontend (Next.js, port `3000`) in a single container.

### Using Docker Compose

1. Copy `.env.example` to `.env` in `frontend/` (optional):
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Start the container stack:
   ```bash
   docker compose up --build
   ```
3. Access services:
   - Frontend UI: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

### Using Docker CLI

```bash
docker build -t better-snpmb --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 .
docker run -p 8000:8000 -p 3000:3000 --env-file frontend/.env better-snpmb
```

## GitHub Release & Docker CI/CD

Automated releases are triggered via `.github/workflows/release.yml` on:
- Pushes to `main` branch (creates `v1.0.<build>` tag release)
- Pushing a release tag (e.g. `v1.0.0`)

The CI/CD pipeline automatically:
1. Generates GitHub Release & release notes.
2. Builds single-container Docker image.
3. Publishes image to GitHub Container Registry (`ghcr.io`).

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

Better SNPMB Data Explorer (B-SNPMB) is an independent open-source project and is **not** affiliated with, authorized, maintained, sponsored, or endorsed by SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru), BP3, or the Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia. All data is retrieved from public data endpoints for educational and research purposes only. Official university admission data must always be verified directly through the [official SNPMB portal](https://snpmb.bppp.kemdikbud.go.id).
