# GlassSheet (CSV Editor)

Excel-like web spreadsheet application with an Apple-glass UI. Supports uploading and editing CSV, XLSX, and XLS files, exporting to XLSX and CSV, project-based file management, and a formula engine with 60+ Excel-compatible functions. The glass aesthetic uses `backdrop-filter: blur()` and translucent surfaces throughout.

## Tech Stack

### Frontend (`frontend/`)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Bundler | Vite | ^7.3.1 |
| Grid library | react-datasheet-grid | ^4.11.5 |
| Unit testing | Vitest | ^4.0.18 |
| E2E testing | Playwright | ^1.58.2 |
| Linting | ESLint 9 (flat config) | ^9.39.1 |
| Lint plugins | typescript-eslint, react-hooks, react-refresh | various |

### Backend (`backend/`)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Fastify | ^5.1.0 |
| Language | TypeScript | ^5.7.2 |
| File parsing | SheetJS (xlsx) | ^0.18.5 |
| File upload | @fastify/multipart | ^9.4.0 |
| CORS | @fastify/cors | ^10.0.1 |
| Dev runner | tsx (watch mode) | ^4.19.2 |

### Root (monorepo orchestration)

| Tool | Version |
|------|---------|
| concurrently | ^9.1.0 |

## Project Structure

```
CSV Editor/
  package.json           # Root: install:all, dev (concurrent), start
  PLAN.md                # Full architecture plan, API design, milestones
  README.md              # Setup and run instructions
  TESTING-GUIDE.md       # 1000-point manual + automated QA checklist
  start.bat              # Windows double-click launcher
  test-data/             # Sample CSV/XLSX files for testing
  .gitignore             # Standard ignores (node_modules, dist, .env, test-results)
  frontend/
    eslint.config.js      # ESLint flat config (TS + React hooks + react-refresh)
    vite.config.ts        # Vite config with API proxy to backend
    tsconfig.json         # Frontend TS config
    src/
      main.tsx            # React entry point
      App.tsx             # Root component, tab state, project state
      App.css             # App-level styles
      index.css           # Global CSS reset and base
      api/
        client.ts         # Fetch wrapper for backend API calls
      components/
        SheetTab.tsx       # Spreadsheet view (grid + ribbon)
        SpreadsheetGrid.tsx  # Grid rendering and cell management
        Ribbon.tsx         # Excel-style toolbar (40+ buttons)
        ProjectsTab.tsx    # Project list (open, rename, delete)
        SettingsTab.tsx    # Settings panel
        ErrorBoundary.tsx  # React error boundary
        formulaColumn.tsx  # Custom column component for formula cells
      styles/
        glass.ts          # Glass effect style constants
        glass.css         # Glass effect CSS classes
      utils/
        formulaParser.ts       # Formula tokenizer and evaluator
        formulaFunctions.ts    # 60+ Excel-compatible function implementations
        formulaExpressions.test.ts  # Expression parser tests
        formulaFunctions.test.ts    # Function implementation tests
        formulaParser.test.ts       # Parser unit tests
        formulaColumnFactory.ts     # Column factory for formula-aware grid
        gridData.ts            # Grid data utilities
        gridData.test.ts       # Grid data tests
        cellRef.ts             # Cell reference (A1-style) utilities
        cellRef.test.ts        # Cell reference tests
        recentProjects.ts      # Recent project tracking (localStorage)
        recentProjects.test.ts # Recent projects tests
        sheetDefaults.ts       # Default sheet dimensions
    e2e/                  # Playwright E2E test specs
    e2e-screenshots/      # Auto-captured E2E screenshots
  backend/
    src/
      index.ts            # Fastify server entry, route registration
      config.ts           # Server configuration (ports, workspace path)
      routes/
        upload.ts          # POST /api/upload (multipart file handling)
        projects.ts        # CRUD routes for projects
        export.ts          # POST /api/export (XLSX/CSV download)
      services/
        fileService.ts     # Workspace file read/write
        importService.ts   # Parse uploaded files (SheetJS)
        exportService.ts   # Generate XLSX/CSV for download
```

## Build & Run

### Quick Start (both servers)

```bash
npm run install:all      # Install root + frontend + backend deps
npm run dev              # Start both servers concurrently
```

Or use `start.bat` on Windows.

### Individual Servers

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173 in your browser.

### Verify

```bash
curl http://localhost:3001/api/health    # Should return {"ok":true}
```

## Testing

```bash
cd frontend && npm run test       # Vitest unit tests
cd frontend && npm run test:e2e   # Playwright E2E (backend must be running)
cd frontend && npm run lint       # ESLint
```

E2E screenshots go to `frontend/e2e-screenshots/`. See `TESTING-GUIDE.md` for the full 1000-point QA checklist.

## API Endpoints

`GET /api/health`, `GET /api/projects`, `POST /api/upload`, `GET /api/projects/:id`, `PUT /api/projects/:id` (save), `PATCH /api/projects/:id` (rename), `DELETE /api/projects/:id`, `POST /api/export` (XLSX/CSV download).

## ESLint (frontend)

Flat config in `eslint.config.js`: typescript-eslint recommended, react-hooks, react-refresh. Unused vars with `_` prefix allowed. `no-control-regex` off.

## Code Patterns

- **Tab-based UI**: `App.tsx` manages active tab state (Sheets, Projects, Settings). Each tab is a separate component.
- **Glass aesthetic**: All UI surfaces use `backdrop-filter: blur()` with semi-transparent backgrounds. Glass style constants are in `styles/glass.ts`.
- **Formula engine**: The formula system is split into parser (`formulaParser.ts`), function library (`formulaFunctions.ts`), and cell reference resolution (`cellRef.ts`). Formulas start with `=`.
- **API client pattern**: All backend calls go through `api/client.ts`. Components do not use `fetch` directly.
- **Service layer**: Backend separates concerns into routes (HTTP handling) and services (business logic). Routes are thin; services do the work.
- **Project persistence**: Projects are stored as `.gsheet` JSON files in a configurable workspace directory on disk.

## Important Files -- Do NOT Modify Without Understanding

- `frontend/src/utils/formulaParser.ts` -- Core formula evaluator. Changes here affect all cell calculations.
- `frontend/src/utils/formulaFunctions.ts` -- Function implementations (SUM, AVERAGE, VLOOKUP, etc.). Each function must handle edge cases.
- `backend/src/services/importService.ts` -- File parsing logic. SheetJS configuration here determines what data is extracted from uploads.
- `PLAN.md` -- Complete architecture specification. Reference this before making structural changes.

## Gotchas and Warnings

- Do NOT use `PORT` environment variable without setting it for BOTH backend and frontend. The frontend Vite config proxies `/api` to the backend port.
- Do NOT add CSS frameworks (Tailwind, Bootstrap). The glass UI is hand-crafted with `backdrop-filter` and must remain consistent.
- Do NOT modify the formula parser without running `npm run test` -- there are extensive unit tests for expression evaluation.
- The grid uses virtualization via react-datasheet-grid. Do NOT replace it with a non-virtualized alternative or large datasets (5k+ rows) will freeze the browser.
- SheetJS is used for both import and export. Only the first sheet of multi-sheet workbooks is loaded (MVP limitation).
- The workspace directory is configurable in `backend/src/config.ts`. If the directory does not exist, the backend creates it on startup.
- Do NOT commit `test-results/`, `playwright-report/`, or `coverage/` directories (they are gitignored).
