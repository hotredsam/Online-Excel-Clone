# GlassSheet — Planning Deliverable (Step 1)

**Project:** GlassSheet — Excel-like web app with Apple-glass UI  
**Status:** Plan only — no implementation yet  
**Date:** 2026-02-11

---

## A) Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BROWSER (Frontend)                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  React + Vite SPA                                                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │  │
│  │  │   Sheets    │  │  Projects   │  │  Settings   │  ← Tab navigation  │  │
│  │  │   (Grid)    │  │  (List UI)  │  │  (Theme…)   │                    │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                    │  │
│  │         │                │                │                            │  │
│  │  ┌──────┴────────────────┴────────────────┴──────┐                    │  │
│  │  │  Spreadsheet component (grid lib)              │  Cell state,       │  │
│  │  │  Keyboard nav, selection, inline edit          │  selection, undo   │  │
│  │  └───────────────────────────────────────────────┘                    │  │
│  │         │                                                              │  │
│  │  ┌──────┴─────────────────────────────────────────┐                   │  │
│  │  │  API client (fetch) — upload, open, save,       │                   │  │
│  │  │  export, list projects, rename, delete          │                   │  │
│  │  └────────────────────────────────────────────────┘                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP (JSON + file upload/download)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOCAL BACKEND (Node.js server)                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  REST API (Express or Fastify)                                         │  │
│  │  • POST /api/upload          • GET  /api/projects                      │  │
│  │  • GET  /api/projects/:id    • PUT  /api/projects/:id (save)           │  │
│  │  • GET  /api/export/:format  • DELETE /api/projects/:id                │  │
│  │  • PATCH /api/projects/:id (rename)                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────┴───────────────────────────────────┐  │
│  │  Services                                                              │  │
│  │  • FileService    — read/write workspace dir, paths, safe names        │  │
│  │  • ImportService  — parse .xlsx (SheetJS), .xls (SheetJS), .csv         │  │
│  │  • ExportService  — write .xlsx (SheetJS), .csv                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────┴───────────────────────────────────┐  │
│  │  Workspace (configurable folder on disk)                               │  │
│  │  • projects/  — .gsheet JSON files (or one workspace file)             │  │
│  │  • Optional: uploads cache, temp export                                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key flows:**
- **Open file:** Browser → GET project by id → Backend reads from workspace (or parsed upload) → Returns sheet data (JSON) → Frontend renders grid.
- **Save:** Frontend sends full sheet JSON → Backend writes to workspace (e.g. `projectId.gsheet`).
- **Export:** Frontend requests export (xlsx/csv) with current sheet data or project id → Backend uses SheetJS/csv writer → Returns file download.
- **Upload:** Browser sends file (xlsx/xls/csv) → Backend parses → Creates project in workspace + returns project id + sheet data.

---

## B) Tech Stack Recommendation

| Layer        | Choice              | Rationale |
|-------------|----------------------|------------|
| **Frontend**| React 18 + Vite      | Fast dev experience, standard ecosystem, good for grid UIs. |
| **Grid / spreadsheet UI** | **react-datasheet-grid** or **Handsontable** (community) or **AG Grid (community)** | Need: cell edit, keyboard nav, virtualized rows for 5k rows. **Recommendation:** Start with **react-datasheet-grid** (lightweight, MIT) or **@silevis/reactgrid** (cell model fits well). If we need more Excel-like features later, consider Handsontable. |
| **Backend** | Node.js + **Fastify** | Slightly faster and cleaner than Express for APIs; good for file handling. Express is fine if you prefer. |
| **File parsing / export** | **SheetJS (xlsx)**   | De facto standard for xlsx; supports xls read and xlsx read/write. One library for both. |
| **CSV**     | **csv-parse** / **csv-stringify** (or built-in with SheetJS for simple cases) | Reliable streaming or in-memory CSV; SheetJS can also parse CSV. We can use SheetJS for CSV for MVP to reduce deps. |
| **Styling** | CSS (or Tailwind) + **backdrop-filter** | Glass effect = `backdrop-filter: blur()` + semi-transparent backgrounds. Tailwind optional. |
| **State**   | React state + context or Zustand (minimal) | No need for Redux for MVP; one “current workbook/sheet” state. |
| **Dev scripts** | npm (or pnpm)       | `dev`, `build`, `start` (backend), `test`. |

**Summary:** React + Vite (frontend), Fastify (backend), SheetJS (xlsx/xls/optional CSV), a lightweight grid library (e.g. react-datasheet-grid or ReactGrid), CSS with backdrop-filter for glass.

---

## C) File Format Strategy

### Import

| Format | Method | MVP scope |
|--------|--------|-----------|
| **.xlsx** | SheetJS `readFile` / `read` → workbook → first sheet (or by name) → row/column array of cell values + optional types | First sheet only; cell values and basic types (string, number, date). No formulas (we read computed value only). |
| **.xls**  | Same SheetJS API (supports legacy .xls) | Same as xlsx — first sheet, values only. |
| **.csv**  | SheetJS `read` with type `'string'` or dedicated CSV parse → 2D array | Single “sheet”; no multi-sheet. Encoding: UTF-8 preferred; try to detect BOM. |

**We will NOT support in MVP:** Macros, pivot tables, charts, embedded objects, multiple sheets on open (only first sheet), formula recalculation (only stored/displayed values), conditional formatting, data validation, print settings.

### Export

| Format | Method | MVP scope |
|--------|--------|-----------|
| **.xlsx** | SheetJS `utils.json_to_sheet` + `book_new` + `writeFile` | One sheet; current grid data only. No charts, macros, or extra metadata. |
| **.csv**  | SheetJS `utils.sheet_to_csv` or csv-stringify from sheet data | One sheet; delimiter config (e.g. comma); UTF-8. |
| **.xls**  | Not in MVP export | Import-only for legacy; export only xlsx + csv. |

**Round-trip:** CSV ↔ grid and XLSX (first sheet) ↔ grid; best effort for types (number, string, date). No formula persistence in MVP.

---

## D) Data Model

### In-memory (frontend + API payload)

- **Workbook / Project**
  - `id`: string (UUID or slug)
  - `name`: string (display name, filename without extension)
  - `createdAt`, `updatedAt`: ISO strings (optional for MVP)
  - `sheets`: array of Sheet (MVP: length 1)

- **Sheet**
  - `name`: string (e.g. "Sheet1")
  - `rows`: number (optional; can be inferred from data)
  - `columns`: number (optional; can be inferred)
  - `data`: 2D array (row-major) — `data[row][col]` = cell value (string | number | null). Empty = `null` or `""`.

- **Cell**
  - No separate object in MVP; value only. Later: `{ value, type, format }`.

### Persisted (on disk — local workspace)

- **Workspace folder** (e.g. `./glassheet-workspace` or configurable):
  - `projects/` — one file per project:
    - `{projectId}.gsheet` (or `{projectId}.json`) containing:
      - `{ id, name, createdAt?, updatedAt?, sheets: [ { name, data: [[...]] } ] }`
  - Optional: `uploads/` for temp uploads before “Save as project”.

- **Naming:** Project id = safe filename (UUID or slug from name). No conflicting filenames.

### Projects list

- Backend lists `projects/*.gsheet` and returns `{ id, name, path?, updatedAt? }` for the Projects tab and “recent files”.

---

## E) API Design

Base URL: `http://localhost:3xxx` (e.g. 3001). All JSON where applicable.

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET    | `/api/health` | Liveness | — | `{ ok: true }` |
| GET    | `/api/projects` | List all projects | — | `{ projects: [{ id, name, updatedAt? }] }` |
| POST   | `/api/upload` | Upload file (xlsx/xls/csv); create project | `multipart/form-data` file | `{ project: { id, name }, sheet: { name, data } }` or open project and return same as GET project |
| GET    | `/api/projects/:id` | Open project (get full workbook) | — | `{ id, name, sheets: [{ name, data }] }` |
| PUT    | `/api/projects/:id` | Save project | `{ name?, sheets: [{ name, data }] }` | `{ ok: true }` |
| PATCH  | `/api/projects/:id` | Rename project | `{ name: string }` | `{ ok: true }` |
| DELETE | `/api/projects/:id` | Delete project | — | `{ ok: true }` |
| POST   | `/api/export` | Export current data to file | `{ projectId?, format: 'xlsx' \| 'csv', sheet?: { name, data } }` | File download (Content-Disposition) or stream |

**Versioning (optional):** Not in MVP. Later: add `GET /api/projects/:id/history` and store snapshots under `projects/:id/versions/`.

**Errors:** 4xx/5xx with `{ error: string, code?: string }`.

---

## F) Milestone Plan

### Milestone 0: Repo scaffold + run scripts  
**Done when:**
- Monorepo or two folders: `frontend/` (Vite + React), `backend/` (Node + Fastify).
- `package.json` in each with: `dev`, `build`, `start` (backend), `test` (if any).
- README with: install deps, run backend, run frontend, open browser.
- Backend serves `GET /api/health` and returns `{ ok: true }`.
- No spreadsheet or file logic yet.

---

### Milestone 1: Grid renders + cell edit + keyboard nav  
**Done when:**
- “Sheets” tab shows a grid (e.g. react-datasheet-grid or ReactGrid) with empty or sample 2D data.
- User can click a cell and edit inline (type, blur or Enter to commit).
- Arrow keys move selection; Enter edits; Tab moves to next cell.
- Grid is the main view when “Sheets” is selected; no file load/save yet.

---

### Milestone 2: Open/upload CSV  
**Done when:**
- Backend has `POST /api/upload` accepting CSV; parses to `{ name, data }` and creates a project in workspace; returns project + sheet.
- Frontend: “Open” or “Upload” flow sends CSV to backend and loads returned sheet into grid.
- Grid displays CSV data correctly (rows/columns); can edit and see changes in memory (save not required yet, or simple “Save” that PUTs to backend).

---

### Milestone 3: Open/upload XLSX and XLS  
**Done when:**
- Backend uses SheetJS to parse .xlsx and .xls in `POST /api/upload`; first sheet only; outputs same shape as CSV (`{ name, data }`).
- Frontend accepts xlsx/xls in same upload flow; grid shows first sheet.
- No export yet; open + edit in memory (and optional save as .gsheet).

---

### Milestone 4: Export CSV and XLSX  
**Done when:**
- Backend: `POST /api/export` (or GET with body alternative) with `format: 'xlsx' | 'csv'` and current sheet data (or projectId); returns file download.
- Frontend: “Export” or “Download” with format choice; triggers download of .xlsx or .csv.
- Exported file opens in Excel or a text editor and matches current grid (values only, no formulas in MVP).

---

### Milestone 5: Projects tab + recent files + rename/delete  
**Done when:**
- “Projects” tab lists all projects from `GET /api/projects` (from workspace).
- User can open a project (load into grid), rename (PATCH), delete (DELETE with confirmation).
- “Recent” or “Open recent” shows last N opened files (frontend storage or backend metadata).
- “Sheets” and “Projects” tabs both work; “Save” from Sheets persists to current project.

---

### Milestone 6: Apple-glass theming pass + polish  
**Done when:**
- UI uses frosted glass: `backdrop-filter: blur()`, semi-transparent panels, subtle borders, soft shadows.
- Typography and spacing feel “Apple-like”; theme is consistent across Sheets, Projects, Settings.
- Settings tab exists (e.g. theme toggle, workspace path display, or placeholder).
- Responsive and performant for medium files (e.g. 5k rows × 50 cols): virtualized grid, no UI freeze on load/save.

---

## Summary

- **Architecture:** Browser SPA (React + Vite + grid lib) ↔ REST API (Fastify) ↔ workspace on disk; SheetJS for xlsx/xls/csv.
- **Data:** Sheet = 2D array of cell values; project = JSON file in workspace; no formulas or multi-sheet in MVP.
- **API:** Upload, list projects, open, save, rename, delete, export (xlsx/csv).
- **Milestones:** 0 → 1 → 2 → 3 → 4 → 5 → 6 with clear “done when” criteria.

Once you approve this plan, implementation can proceed one milestone at a time with small PR-sized chunks, tests for backend and import/export, and a README for setup and run.
