# Better SNPMB Data Explorer — Frontend (B-SNPMB Frontend)

Modern Next.js web application for exploring, filtering, comparing, and analyzing Indonesian State University Admission (SNBP and SNBT) data.

## File Tree & Architecture

```text
frontend/
├── package.json                 # Project dependencies, scripts, and package metadata
├── next.config.ts               # Next.js configuration settings
├── tsconfig.json                # TypeScript compiler configuration
├── postcss.config.mjs           # PostCSS configuration for Tailwind CSS v4
├── README.md                    # Frontend documentation and file architecture
├── src/
│   ├── app/                     # Next.js App Router pages and layout handlers
│   │   ├── layout.tsx           # Global root layout with header, main area, & footer
│   │   ├── page.tsx             # Homepage with landing stats and search entrypoints
│   │   ├── globals.css          # Global styling & Tailwind directives
│   │   ├── search/              # Search & filter view for SNBP and SNBT pathways
│   │   ├── ptn/[id]/            # University detail view & study program lists
│   │   └── compare/             # Side-by-side study program comparison page
│   ├── components/              # Modular UI components
│   │   ├── layout/              # Header, Footer, and DisclaimerAlert components
│   │   ├── ptn/                 # PTN list cards, Prodi tables, and filter bars
│   │   └── ui/                  # Reusable UI primitives (badges, buttons, inputs)
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCompare.ts        # LocalStorage state manager for study program comparison
│   │   └── useSearchState.ts    # URL query parameter sync and filter management
│   ├── utils/                   # Helper functions
│   │   ├── formatters.ts        # Data formatting, percentages, and string helpers
│   │   └── exportExcel.ts       # XLSX workbook generator for downloading dataset exports
│   └── types/                   # TypeScript interfaces (PTN, Prodi, FilterTypes)
└── public/                      # Static assets and favicons
```

### Key Views & Components

- **`src/app/page.tsx`**: Homepage containing application statistics, search entrypoints, and standard disclaimer notice.
- **`src/app/search/`**: Interactive search and filtering page supporting province, city, and pathway filters.
- **`src/app/ptn/[id]/`**: University detail page displaying study program statistics, historical applicant trends, and competition ratios.
- **`src/app/compare/`**: Side-by-side comparison page for up to 4 study programs.
- **`src/components/layout/DisclaimerAlert.tsx`**: Dedicated disclaimer notice component presented across all primary views.

## Setup & Running

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn / bun)

### Environment Configuration

Copy `.env.example` to `.env` before running the development server:

```bash
cp .env.example .env # Or `copy .env.example .env` on Windows
```

| Variable | Default | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://127.0.0.1:8000` | Backend API base URL for REST API calls |

### Development Server

```bash
cd frontend
npm install
npm run dev
```

The web application runs locally at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

## Disclaimer

Better SNPMB Data Explorer (B-SNPMB) is an independent open-source project and is **not** affiliated with, authorized, maintained, sponsored, or endorsed by SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru), BP3, or the Ministry of Education, Culture, Research, and Technology of Indonesia. All data displayed on this website is obtained from public API endpoints for exploratory and educational purposes only. Always verify official admission statistics directly at the [official SNPMB portal](https://snpmb.bppp.kemdikbud.go.id).
