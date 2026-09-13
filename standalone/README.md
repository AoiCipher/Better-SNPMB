# Better SNPMB Data Explorer — Standalone Scraper (B-SNPMB Standalone)

Standalone CLI utility to extract, sanitize, and export official Indonesian State University Admission (SNBP and SNBT) data to JSON files.

## File Tree & Architecture

```text
standalone/
├── main.py                   # CLI entrypoint script (`snpmb-pull`)
├── fetcher.py                # Asynchronous HTTP client & dataset extraction pipeline
├── cleaner.py                # Data sanitization, 5-year trend calculations, & schema mapping
├── pyproject.toml            # Project dependencies and CLI entrypoint configuration
├── README.md                 # Standalone scraper documentation and usage guide
└── tests/
    └── test_standalone.py    # Pytest automated test suite
```

### Module Descriptions

- **`main.py`**: CLI entrypoint script (`snpmb-pull`) that initiates the extraction process and writes compiled results to a output JSON file (`unifinfo.json` by default).
- **`fetcher.py`**: Asynchronous worker using `aiohttp` to request university list, prodi statistics, and provincial distribution data concurrently.
- **`cleaner.py`**: Normalizes raw upstream payloads into clean structured dicts, calculating acceptance rates and multi-year applicant statistics.
- **`tests/test_standalone.py`**: Pytest test suite validating data transformation functions, trend calculations, and file export integrity.

## Installation & Setup

### Prerequisites

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager

### Running the CLI Scraper

```bash
cd standalone
uv sync

# Export dataset to default output path (unifinfo.json)
uv run snpmb-pull

# Export dataset to custom output path
uv run snpmb-pull custom_output.json
```

### Running Tests

```bash
uv run pytest
```

## Disclaimer

Better SNPMB Data Explorer (B-SNPMB) is an independent open-source project and is **not** affiliated with, authorized, maintained, sponsored, or endorsed by SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru), BP3, or the Ministry of Education, Culture, Research, and Technology of Indonesia. All data extracted by this tool is retrieved from public data endpoints for research and educational purposes only. Always verify official admission statistics directly at the [official SNPMB portal](https://snpmb.id).
