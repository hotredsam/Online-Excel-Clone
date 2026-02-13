# GlassSheet

Excel-like web app with Apple-glass UI. Spreadsheet grid editing, upload/open (.xlsx, .xls, .csv), export (.xlsx, .csv), and local file management.

## Setup

- **Node.js** 18+ and npm (or pnpm) required.

### Install dependencies

**Option A — From repo root (works in PowerShell and CMD):**

```bash
npm run install:all
```

**Option B — Manual (PowerShell: use `;`; run from repo root):**

```bash
npm install
cd frontend; npm install
cd ..\backend; npm install
```

Run each line in order, or paste all three at once.

On Bash or CMD you can use `&&`:  
`cd frontend && npm install && cd .. && cd backend && npm install`

## Run

### Option A: Run frontend and backend separately

**Terminal 1 — Backend (port 3001):**
```bash
cd backend; npm run dev
```
(PowerShell: use `;`. Bash/CMD: `cd backend && npm run dev`.)

**Terminal 2 — Frontend (port 5173):**
```bash
cd frontend; npm run dev
```
(PowerShell: use `;`. Bash/CMD: `cd frontend && npm run dev`.)

Then open **http://localhost:5173** in your browser.

**Port 3001 already in use?** Use a different port by setting `PORT` for **both** backend and frontend (so the frontend proxy matches):

- **PowerShell:** `$env:PORT=3002; cd backend; npm run dev` (terminal 1) and `$env:PORT=3002; cd frontend; npm run dev` (terminal 2).
- **CMD:** `set PORT=3002` then run backend and frontend in separate windows.

### Option B: Run both from repo root

```bash
npm run dev
```
(Runs backend and frontend concurrently from root.)

### Option C: Windows — double-click start

Run **`start.bat`** in the project root to start both servers. Then open **http://localhost:5173**.

## Verify

- Backend: `curl http://localhost:3001/api/health` → `{"ok":true}`
- Frontend: open http://localhost:5173 — Sheets tab shows the grid; use Upload to open CSV/XLSX/XLS, Save to persist, Projects to list/open/rename/delete. Export downloads XLSX or CSV.
- The grid uses virtualization and should stay responsive for large sheets (e.g. 5k rows).

## Formulas

Type `=` in any cell to enter a formula. Supported functions (Excel-like):

**Math & stats:** SUM, AVERAGE, COUNT, MIN, MAX, MEDIAN, PRODUCT, SUMIF, COUNTIF, AVERAGEIF  
**Logic:** IF, AND, OR, NOT, TRUE, FALSE  
**Text:** CONCATENATE, LEFT, RIGHT, MID, LEN, UPPER, LOWER, TRIM  
**Math:** ROUND, ROUNDUP, ROUNDDOWN, ABS, SQRT, MOD, POWER, INT, FLOOR, CEILING, EXP, LN, LOG, SIN, COS, TAN, PI  
**Lookup:** VLOOKUP, INDEX, MATCH  
**Info:** ISNUMBER, ISTEXT, ISBLANK  
**Date/time:** TODAY, NOW  

Examples: `=SUM(A1:A10)`, `=IF(B1>0,"Yes","No")`, `=1+2`, `=SUM(1,2,3)`.

## E2E tests (Playwright)

From the **frontend** directory (with backend running or use root `npm run dev`):

```bash
cd frontend
npm run test:e2e
```

Runs 9 tests: app load, tabs, ribbon (40+ tools), grid visibility, formula `=1+2`, and `=SUM(1,2,3)`.

## Scripts

| Where    | Script   | Description              |
|----------|----------|--------------------------|
| frontend | `npm run dev`    | Vite dev server          |
| frontend | `npm run build`  | Production build         |
| frontend | `npm run test:e2e` | Playwright E2E tests   |
| frontend | `npm run preview`| Preview production build |
| backend  | `npm run dev`    | TSX watch (no build)     |
| backend  | `npm run build`  | Compile TypeScript       |
| backend  | `npm run start`  | Run compiled `dist/`     |

## Project layout

- `frontend/` — React + Vite SPA
- `backend/`  — Fastify API (file handling, import/export)
- `PLAN.md`   — Product and architecture plan
