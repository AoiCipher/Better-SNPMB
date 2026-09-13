# AGENTS.md

## Overview
Async scraper for Indonesian university admission (SNPMB) study program (prodi) data.

## Environment & Commands
- VENV: `.venv` (Python 3.14)
- Run scraper: `.venv\Scripts\python.exe main.py`

## Architecture
- `main.py`: Main entrypoint (`snbp()`, `snbt()`) targeting SNPMB proxy endpoints.
- `src/fetcher.py`: Async fetcher (`aiohttp`) calling `clean_prodi()` and saving output to `univinfo.json`.
- `src/cleaner.py`: Data transformer calculating admission acceptance rates (`chance_5_year`, yearly `chance`) and standardizing JSON structure.

## Quirks & Gotchas
- `univinfo.json`: Overwritten on every scraper execution (`DEFAULT_OUT` in `src/fetcher.py`).
- `src/__init__.py`: `snbp` and `snbt` are included in `__all__` but commented out (functions reside in `main.py`).
- `pyrightconfig.json`: Virtual environment resolved to `.venv`.
