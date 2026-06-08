# Graph Report - .  (2026-06-07)

## Corpus Check
- 79 files · ~52,239 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 321 nodes · 423 edges · 34 communities (30 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Client & Project Types|API Client & Project Types]]
- [[_COMMUNITY_Backend Routes & Services|Backend Routes & Services]]
- [[_COMMUNITY_Frontend Package Deps|Frontend Package Deps]]
- [[_COMMUNITY_Cell Ref & Formula Tests|Cell Ref & Formula Tests]]
- [[_COMMUNITY_Spreadsheet Grid Components|Spreadsheet Grid Components]]
- [[_COMMUNITY_TS App Config|TS App Config]]
- [[_COMMUNITY_TS Node Config|TS Node Config]]
- [[_COMMUNITY_Backend Package Deps|Backend Package Deps]]
- [[_COMMUNITY_Agent Consensus State|Agent Consensus State]]
- [[_COMMUNITY_Session History Record|Session History Record]]
- [[_COMMUNITY_Memory Hooks Config|Memory Hooks Config]]
- [[_COMMUNITY_Current Session State|Current Session State]]
- [[_COMMUNITY_Root TS Config|Root TS Config]]
- [[_COMMUNITY_Root Monorepo Scripts|Root Monorepo Scripts]]
- [[_COMMUNITY_NPM Build Scripts|NPM Build Scripts]]
- [[_COMMUNITY_React Error Boundary|React Error Boundary]]
- [[_COMMUNITY_Ranked Context Cache|Ranked Context Cache]]
- [[_COMMUNITY_Glass Style Constants|Glass Style Constants]]
- [[_COMMUNITY_Permissions Settings|Permissions Settings]]
- [[_COMMUNITY_Formula Mouse E2E|Formula Mouse E2E]]
- [[_COMMUNITY_TS Project References|TS Project References]]
- [[_COMMUNITY_Everyday Usage E2E|Everyday Usage E2E]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `compilerOptions` - 18 edges
3. `CellValue` - 12 edges
4. `scripts` - 10 edges
5. `compilerOptions` - 9 edges
6. `parseErrorResponse()` - 8 edges
7. `throwApiError()` - 8 edges
8. `parseCellRef()` - 7 edges
9. `parseRange()` - 6 edges
10. `getColumnCount()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `SheetTabProps` --references--> `CellValue`  [EXTRACTED]
  frontend/src/components/SheetTab.tsx → frontend/src/utils/gridData.ts
- `SpreadsheetGridProps` --references--> `CellValue`  [EXTRACTED]
  frontend/src/components/SpreadsheetGrid.tsx → frontend/src/utils/gridData.ts
- `App()` --calls--> `getDefaultSheetData()`  [EXTRACTED]
  frontend/src/App.tsx → frontend/src/utils/sheetDefaults.ts
- `SheetTab()` --calls--> `colIndexToLetter()`  [EXTRACTED]
  frontend/src/components/SheetTab.tsx → frontend/src/utils/gridData.ts
- `SheetTab()` --calls--> `getColumnCount()`  [EXTRACTED]
  frontend/src/components/SheetTab.tsx → frontend/src/utils/gridData.ts

## Import Cycles
- None detected.

## Communities (34 total, 4 thin omitted)

### Community 0 - "API Client & Project Types"
Cohesion: 0.13
Nodes (23): deleteProject(), exportSheet(), getProject(), listProjects(), parseErrorResponse(), Project, ProjectMeta, ProjectRef (+15 more)

### Community 1 - "Backend Routes & Services"
Cohesion: 0.12
Nodes (23): exportRoutes(), projectRoutes(), uploadRoutes(), CellValue, exportToCsv(), exportToXlsx(), deleteProject(), ensureProjectsDir() (+15 more)

### Community 2 - "Frontend Package Deps"
Cohesion: 0.08
Nodes (25): dependencies, react, react-datasheet-grid, react-dom, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+17 more)

### Community 3 - "Cell Ref & Formula Tests"
Cohesion: 0.19
Nodes (15): colLetterToIndex(), letterToColIndex(), parseCellRef(), parseRange(), ctx, formulaCases, formulaCases2, EvalContext (+7 more)

### Community 4 - "Spreadsheet Grid Components"
Cohesion: 0.17
Nodes (16): FormulaCellComponent, FormulaColumnData, SheetTab(), SheetTabProps, SpreadsheetGrid, SpreadsheetGridProps, SpreadsheetGridRefHandle, App() (+8 more)

### Community 5 - "TS App Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 6 - "TS Node Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 7 - "Backend Package Deps"
Cohesion: 0.12
Nodes (16): dependencies, fastify, @fastify/cors, @fastify/multipart, xlsx, devDependencies, tsx, @types/node (+8 more)

### Community 8 - "Agent Consensus State"
Cohesion: 0.14
Nodes (13): consensus, history, pending, createdAt, initialized, queen, agentId, electedAt (+5 more)

### Community 9 - "Session History Record"
Cohesion: 0.15
Nodes (12): context, cwd, duration, endedAt, id, metrics, commands, edits (+4 more)

### Community 10 - "Memory Hooks Config"
Cohesion: 0.17
Nodes (11): features, agentTeams, autoMemory, hooks, statusLine, memory, importOnSessionStart, storePath (+3 more)

### Community 11 - "Current Session State"
Cohesion: 0.17
Nodes (11): context, cwd, id, metrics, commands, edits, errors, tasks (+3 more)

### Community 12 - "Root TS Config"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 13 - "Root Monorepo Scripts"
Cohesion: 0.18
Nodes (10): devDependencies, concurrently, name, private, scripts, dev, dev:backend, dev:frontend (+2 more)

### Community 14 - "NPM Build Scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, preview, test, test:e2e, test:e2e:ui (+2 more)

### Community 15 - "React Error Boundary"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 16 - "Ranked Context Cache"
Cohesion: 0.50
Nodes (3): computedAt, entries, version

### Community 17 - "Glass Style Constants"
Cohesion: 0.50
Nodes (3): GlassClass, glassClasses, glassMotion

## Knowledge Gaps
- **173 isolated node(s):** `schemaVersion`, `profile`, `hooks`, `statusLine`, `autoMemory` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CellValue` connect `Cell Ref & Formula Tests` to `API Client & Project Types`, `Spreadsheet Grid Components`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Build Scripts` to `Frontend Package Deps`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `schemaVersion`, `profile`, `hooks` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Client & Project Types` be split into smaller, more focused modules?**
  _Cohesion score 0.1310483870967742 - nodes in this community are weakly interconnected._
- **Should `Backend Routes & Services` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._
- **Should `Frontend Package Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `TS App Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._