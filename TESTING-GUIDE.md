# GlassSheet — 1000-Point Testing Guide

Run the app: from project root run `npm run dev` or `start.bat`, then open **http://localhost:5173**.

**Screenshots from automated everyday flow** are in **`frontend/e2e-screenshots/`**:  
`01-initial-load.png` through `11-after-export-csv.png`. To regenerate them, run:  
`cd frontend && npm run test:e2e -- e2e/everyday-usage.spec.ts` (with backend + frontend already running, or let Playwright start them).

---

## 1. Environment & setup (Points 1–50)

- [ ] 1. Node.js 18+ installed
- [ ] 2. npm available in PATH
- [ ] 3. Repo cloned/opened in project root
- [ ] 4. Root `package.json` exists
- [ ] 5. `npm run install:all` completes without error
- [ ] 6. `frontend/package.json` exists
- [ ] 7. `backend/package.json` exists
- [ ] 8. No critical vulnerabilities on `npm install`
- [ ] 9. `frontend/node_modules` present after install
- [ ] 10. `backend/node_modules` present after install
- [ ] 11. Backend `tsconfig.json` exists
- [ ] 12. Frontend `tsconfig.json` exists
- [ ] 13. Frontend Vite config exists
- [ ] 14. Backend port 3001 free (or PORT set)
- [ ] 15. Frontend port 5173 free
- [ ] 16. Workspace dir writable (backend)
- [ ] 17. No firewall blocking localhost:3001
- [ ] 18. No firewall blocking localhost:5173
- [ ] 19. Browser supports ES modules
- [ ] 20. Browser supports backdrop-filter (glass UI)
- [ ] 21. `npm run dev` from root starts without error
- [ ] 22. Backend process logs "listening" or similar
- [ ] 23. Frontend Vite shows "Local: http://localhost:5173"
- [ ] 24. `start.bat` exists in root (Windows)
- [ ] 25. Double-clicking `start.bat` opens a terminal
- [ ] 26. Backend health: `curl http://localhost:3001/api/health` returns `{"ok":true}`
- [ ] 27. Frontend loads in browser at http://localhost:5173
- [ ] 28. No console errors on initial page load
- [ ] 29. Page title is "GlassSheet"
- [ ] 30. Favicon loads
- [ ] 31. Fonts load (Inter or fallback)
- [ ] 32. Root div `#root` is populated
- [ ] 33. React app mounts
- [ ] 34. No 404s for main JS
- [ ] 35. No 404s for main CSS
- [ ] 36. API proxy /api forwards to backend
- [ ] 37. CORS allows frontend origin
- [ ] 38. Hot reload works (edit a component, save, see change)
- [ ] 39. Backend tsx watch restarts on file change
- [ ] 40. Build: `npm run build` in frontend succeeds
- [ ] 41. Build: `npm run build` in backend succeeds
- [ ] 42. Unit tests: `npm run test` in frontend passes
- [ ] 43. E2E tests: `npm run test:e2e` in frontend can run (with backend up)
- [ ] 44. Lint: `npm run lint` in frontend passes
- [ ] 45. TypeScript: no tsc errors in frontend
- [ ] 46. TypeScript: no tsc errors in backend
- [ ] 47. test-data/sample.csv exists
- [ ] 48. README run instructions accurate
- [ ] 49. PLAN.md describes architecture
- [ ] 50. No .env required for default run

---

## 2. Launch & first paint (Points 51–100)

- [ ] 51. **Screenshot: 01-initial-load.png** — Full app visible
- [ ] 52. Tab bar visible at top
- [ ] 53. Three tabs visible: Sheets, Projects, Settings
- [ ] 54. "Sheets" tab is active by default
- [ ] 55. Ribbon visible below tab bar
- [ ] 56. Ribbon has "Home" tab
- [ ] 57. Main content area visible (sheet or panel)
- [ ] 58. No blank white screen
- [ ] 59. Background gradient or glass visible
- [ ] 60. Text readable (contrast)
- [ ] 61. No overlay blocking interaction
- [ ] 62. Cursor normal (pointer where appropriate)
- [ ] 63. No infinite loading spinner
- [ ] 64. No "Failed to fetch" on load
- [ ] 65. Grid or empty state visible on Sheets tab
- [ ] 66. Scrollbars only when needed
- [ ] 67. Window resize doesn’t break layout
- [ ] 68. Zoom 100%: layout correct
- [ ] 69. Zoom 125%: still usable
- [ ] 70. Zoom 90%: still usable
- [ ] 71. No horizontal overflow on 1920×1080
- [ ] 72. No horizontal overflow on 1366×768
- [ ] 73. Focus visible on tab (keyboard)
- [ ] 74. No duplicate focus rings
- [ ] 75. Tab order logical (Sheets → Projects → Settings)
- [ ] 76. First focusable element focusable
- [ ] 77. Document has one h1 or main heading (via tabs/panels)
- [ ] 78. Landmarks present (banner, main)
- [ ] 79. No autofocus trap
- [ ] 80. Reload preserves default tab (Sheets)
- [ ] 81. Hard reload (Ctrl+F5) still works
- [ ] 82. Back/forward doesn’t break app
- [ ] 83. Console: no unhandled promise rejection on load
- [ ] 84. Console: no React warnings on load
- [ ] 85. Memory: no obvious leak on repeated load
- [ ] 86. Network: no repeated failed requests
- [ ] 87. Time to interactive &lt; 5 s on cold load
- [ ] 88. No flash of unstyled content
- [ ] 89. Reduced motion respected (if implemented)
- [ ] 90. Prefers-color-scheme not breaking glass
- [ ] 91. Touch device: tap targets adequate
- [ ] 92. No "localhost wants to" permission prompts on load
- [ ] 93. Service worker not required
- [ ] 94. Works in Chrome
- [ ] 95. Works in Edge
- [ ] 96. Works in Firefox
- [ ] 97. Works in Safari (if available)
- [ ] 98. Incognito/private: app works
- [ ] 99. Second tab: same origin works
- [ ] 100. Refresh after 5 min idle: still works

---

## 3. Tab bar (Points 101–200)

- [ ] 101. **Screenshot: 02-sheets-tab-active.png** — Sheets selected
- [ ] 102. Tab "Sheets" has correct label
- [ ] 103. Tab "Projects" has correct label
- [ ] 104. Tab "Settings" has correct label
- [ ] 105. Active tab visually distinct
- [ ] 106. Inactive tabs still visible
- [ ] 107. Hover on Sheets: visual feedback
- [ ] 108. Hover on Projects: visual feedback
- [ ] 109. Hover on Settings: visual feedback
- [ ] 110. Click Sheets: stays on Sheets (if already there)
- [ ] 111. Click Projects: switches to Projects
- [ ] 112. **Screenshot: 03-projects-tab.png** — Projects panel
- [ ] 113. Projects panel shows "Projects" heading
- [ ] 114. Click Settings: switches to Settings
- [ ] 115. **Screenshot: 04-settings-tab.png** — Settings panel
- [ ] 116. Settings panel shows "Settings" heading
- [ ] 117. Click Sheets again: back to grid
- [ ] 118. Keyboard: Tab to focus first tab
- [ ] 119. Keyboard: Arrow keys move between tabs (if implemented)
- [ ] 120. Keyboard: Enter activates focused tab
- [ ] 121. role="tablist" on nav
- [ ] 122. role="tab" on each tab button
- [ ] 123. aria-selected true on active tab
- [ ] 124. aria-selected false on others
- [ ] 125. Tab panel has correct aria-labelledby
- [ ] 126. No layout shift when switching tabs
- [ ] 127. Content switches without full page reload
- [ ] 128. State preserved when switching away and back (e.g. grid data)
- [ ] 129. Rapid click on tabs: no crash
- [ ] 130. Double-click tab: no duplicate action
- [ ] 131. Right-click tab: no broken behavior
- [ ] 132. Tab bar doesn’t scroll away
- [ ] 133. Tab bar height consistent
- [ ] 134. Tab bar background/blur visible
- [ ] 135. Tab bar border bottom visible
- [ ] 136. Tab text not truncated
- [ ] 137. Tab text not wrapped
- [ ] 138. Focus ring on tab (focus-visible only)
- [ ] 139. Active tab not confused with hover
- [ ] 140. Touch: tap switches tab
- [ ] 141. Touch: no 300ms delay
- [ ] 142. Screen reader: tab list announced
- [ ] 143. Screen reader: current tab announced
- [ ] 144. No focus trap inside tab panel
- [ ] 145. Escape doesn’t close app (unless intended)
- [ ] 146. Tab order: Sheets index 0, Projects 1, Settings 2
- [ ] 147. Projects panel scrolls if content long
- [ ] 148. Settings panel scrolls if content long
- [ ] 149. Sheets panel fills remaining height
- [ ] 150. No empty gap below tab bar
- [ ] 151–200. (Reserve: repeat tab bar with different viewport sizes, zoom, and RTL if applicable)

---

## 4. Ribbon (Points 201–350)

- [ ] 201. Ribbon always visible on Sheets tab
- [ ] 202. Ribbon not visible on Projects tab
- [ ] 203. Ribbon not visible on Settings tab
- [ ] 204. "File" group label visible
- [ ] 205. "Open" button visible in File group
- [ ] 206. "Save" button visible
- [ ] 207. "Save As" (or placeholder) visible
- [ ] 208. "XLSX" export button visible
- [ ] 209. "CSV" export button visible
- [ ] 210. "Close" or placeholder visible
- [ ] 211. "Clipboard" group visible
- [ ] 212. "Paste" button visible
- [ ] 213. "Cut" button visible
- [ ] 214. "Copy" button visible
- [ ] 215. "Format" (painter) visible
- [ ] 216. "Font" group visible
- [ ] 217. "B" (Bold) visible
- [ ] 218. "I" (Italic) visible
- [ ] 219. "U" (Underline) visible
- [ ] 220. "S" (Strikethrough) visible
- [ ] 221. Font size control visible
- [ ] 222. Font color control visible
- [ ] 223. Fill color control visible
- [ ] 224. "Alignment" group visible
- [ ] 225. Align left/center/right visible
- [ ] 226. Vertical align controls visible
- [ ] 227. Wrap text control visible
- [ ] 228. "Number" group visible
- [ ] 229. General/Number/Currency/Percent/Date visible
- [ ] 230. "Cells" group visible
- [ ] 231. Insert row/column visible
- [ ] 232. Delete row/column visible
- [ ] 233. Format cells visible
- [ ] 234. "Editing" group visible
- [ ] 235. Fill down, Clear, Sort, Filter visible
- [ ] 236. "Data" group visible
- [ ] 237. "View" group visible
- [ ] 238. Zoom in/out visible
- [ ] 239. Gridlines visible
- [ ] 240. Total ribbon buttons ≥ 40
- [ ] 241. Click "Open": file picker or upload flow
- [ ] 242. Open with CSV: grid updates
- [ ] 243. **Screenshot: 07-after-upload-csv.png** — After upload
- [ ] 244. Click "Save": no error when project exists
- [ ] 245. **Screenshot: 08-after-save.png** — After save
- [ ] 246. Save when no project: error or disabled
- [ ] 247. Click "XLSX": download starts or completes
- [ ] 248. **Screenshot: 10-after-export-xlsx.png**
- [ ] 249. Click "CSV": download starts or completes
- [ ] 250. **Screenshot: 11-after-export-csv.png**
- [ ] 251. Project name shown when project loaded
- [ ] 252. Upload error message shown in ribbon when upload fails
- [ ] 253. Export error shown when export fails
- [ ] 254. Save status (Saving/Saved/Error) visible when saving
- [ ] 255. Ribbon buttons have title/tooltip
- [ ] 256. Disabled buttons visually distinct
- [ ] 257. Hover on ribbon button: feedback
- [ ] 258. Active/pressed state on button (if any)
- [ ] 259. Focus ring on ribbon button (keyboard)
- [ ] 260. No focus on hidden file input unless triggered
- [ ] 261. File input accepts .csv,.xlsx,.xls
- [ ] 262. Choosing file triggers upload
- [ ] 263. Cancel file dialog: no error
- [ ] 264. Paste button click: no crash
- [ ] 265. Copy button click: no crash
- [ ] 266. Bold click: no crash
- [ ] 267. Ribbon doesn’t wrap awkwardly (reasonable width)
- [ ] 268. Ribbon groups don’t overlap
- [ ] 269. Ribbon second row visible
- [ ] 270. All group labels readable
- [ ] 271. Ribbon background distinct from content
- [ ] 272. Ribbon border visible
- [ ] 273. Header text readable (dark on light ribbon)
- [ ] 274. Icons/symbols readable
- [ ] 275. No truncated labels
- [ ] 276–350. (Reserve: each ribbon button click, keyboard nav, a11y, and edge cases)

---

## 5. Spreadsheet grid (Points 351–500)

- [ ] 351. **Screenshot: 05-formula-1plus2.png** — Formula in cell
- [ ] 352. Grid container visible
- [ ] 353. Row headers (numbers) visible
- [ ] 354. Column headers (A, B, C…) visible
- [ ] 355. Data cells visible
- [ ] 356. At least 26 columns shown (A–Z)
- [ ] 357. Many rows available (e.g. 100+)
- [ ] 358. Click cell A1: cell selected
- [ ] 359. Selected cell has visible focus/outline
- [ ] 360. Type "test": text appears in cell
- [ ] 361. Press Enter: value committed
- [ ] 362. **Screenshot: 06-plain-text-cell.png** — Text cell
- [ ] 363. Press Tab: next cell focused
- [ ] 364. Arrow keys: selection moves
- [ ] 365. Arrow Down: moves down
- [ ] 366. Arrow Up: moves up
- [ ] 367. Arrow Left/Right: move left/right
- [ ] 368. Click another cell: that cell selected
- [ ] 369. Type number: number stored
- [ ] 370. Type "=1+2": formula bar or cell shows formula
- [ ] 371. Press Enter: cell shows 3
- [ ] 372. Cell shows result not formula (after commit)
- [ ] 373. Click cell with formula: can show formula for edit
- [ ] 374. Edit formula: result updates on commit
- [ ] 375. Empty cell: shows empty
- [ ] 376. Long text: truncates or wraps (per design)
- [ ] 377. Grid scrolls vertically
- [ ] 378. Grid scrolls horizontally
- [ ] 379. Headers stay visible when scrolling (or scroll with)
- [ ] 380. No duplicate row/column headers
- [ ] 381. Cell borders visible
- [ ] 382. Cell text readable (contrast)
- [ ] 383. Grid background distinct
- [ ] 384. No overlapping cells
- [ ] 385. Resize window: grid adapts
- [ ] 386. Many rows: virtualization (no 10k DOM nodes)
- [ ] 387. Scroll performance smooth
- [ ] 388. Formula in A1: type in B1, A1 still correct
- [ ] 389. Reference A1 in B1: B1 updates when A1 changes
- [ ] 390. Multiple formulas: all evaluate
- [ ] 391. Escape during edit: cancels edit
- [ ] 392. Escape when selected: no crash
- [ ] 393. Copy cell: (if implemented) works
- [ ] 394. Paste: (if implemented) works
- [ ] 395. Delete key: clears cell (if implemented)
- [ ] 396. Undo: (if implemented) works
- [ ] 397. Click row header: (if implemented) selects row
- [ ] 398. Click column header: (if implemented) selects column
- [ ] 399. Double-click cell: enters edit mode
- [ ] 400. Click cell while editing formula: inserts cell ref (e.g. A1)
- [ ] 401. Grid has role or aria (table/grid)
- [ ] 402. Cell has accessible name (e.g. A1)
- [ ] 403. Focus order: left-to-right, top-to-bottom
- [ ] 404. No focus skip
- [ ] 405. Screen reader: cell value announced
- [ ] 406. Screen reader: position announced
- [ ] 407. Touch: tap to select cell
- [ ] 408. Touch: double-tap to edit
- [ ] 409. No accidental zoom on double-tap
- [ ] 410. Right-click: (if context menu) works
- [ ] 411. Grid doesn’t steal focus from ribbon
- [ ] 412. Tab from grid: moves to next focusable
- [ ] 413. Shift+Tab: moves back
- [ ] 414. Grid fills available height
- [ ] 415. Min height respected
- [ ] 416. No scroll inside scroll (nested scroll)
- [ ] 417. Gutter (row numbers) aligned
- [ ] 418. Column widths reasonable
- [ ] 419. Row height consistent
- [ ] 420. Formula error shows #ERROR! or similar
- [ ] 421. Circular ref: doesn’t hang
- [ ] 422. Very long formula: doesn’t break layout
- [ ] 423. Paste 100 rows: grid updates
- [ ] 424. Clear all: grid empty
- [ ] 425. Reload after edit: data lost (unless saved)
- [ ] 426. Save then reload: data persists (via project)
- [ ] 427. Empty project: grid empty
- [ ] 428. Load project: grid shows project data
- [ ] 429. Switch project: grid updates
- [ ] 430. Large file (e.g. 1000 rows): loads
- [ ] 431. Large file: scroll smooth
- [ ] 432. Special chars in cell: display correctly
- [ ] 433. Unicode in cell: works
- [ ] 434. Emoji in cell: (if supported) works
- [ ] 435. Negative numbers: display correctly
- [ ] 436. Decimals: display correctly
- [ ] 437. Scientific notation: (if supported) works
- [ ] 438. Date in cell: (if supported) works
- [ ] 439. Empty string vs null: consistent
- [ ] 440. Leading zeros: preserved or per design
- [ ] 441–500. (Reserve: more grid edge cases, keyboard combos, selection ranges)

---

## 6. Formulas (Points 501–600)

- [ ] 501. =1+2 → 3
- [ ] 502. =2*3 → 6
- [ ] 503. =10/2 → 5
- [ ] 504. =2^3 → 8
- [ ] 505. =1+2*3 → 7 (order of ops)
- [ ] 506. =(1+2)*3 → 9
- [ ] 507. =SUM(1,2,3) → 6
- [ ] 508. =AVERAGE(2,4,6) → 4
- [ ] 509. =MIN(5,2,8) → 2
- [ ] 510. =MAX(5,2,8) → 8
- [ ] 511. =IF(1>0,"yes","no") → yes
- [ ] 512. =IF(0,"a","b") → b
- [ ] 513. =AND(1,1) → 1
- [ ] 514. =OR(0,1) → 1
- [ ] 515. =NOT(0) → 1
- [ ] 516. =LEN("hello") → 5
- [ ] 517. =LEFT("Hello",2) → He
- [ ] 518. =RIGHT("Hello",2) → lo
- [ ] 519. =MID("Hello",2,2) → el
- [ ] 520. =UPPER("hi") → HI
- [ ] 521. =LOWER("HI") → hi
- [ ] 522. =TRIM("  x  ") → x
- [ ] 523. =CONCATENATE("a","b") → ab
- [ ] 524. =ROUND(2.5) → 3
- [ ] 525. =ABS(-5) → 5
- [ ] 526. =SQRT(4) → 2
- [ ] 527. =MOD(10,3) → 1
- [ ] 528. =POWER(2,4) → 16
- [ ] 529. =INT(3.9) → 3
- [ ] 530. =FLOOR(2.7) → 2
- [ ] 531. =CEILING(2.1) → 3
- [ ] 532. =A1 (reference) → value of A1
- [ ] 533. =A1+B1 → sum of A1 and B1
- [ ] 534. =SUM(A1:A5) → sum of range
- [ ] 535. =ROWS(A1:B10) → 10
- [ ] 536. =COLUMNS(A1:Z1) → 26
- [ ] 537. =FIND("o","Hello") → 5
- [ ] 538. =IFERROR(1/0,"err") → err
- [ ] 539. =PROPER("hello world") → Hello World
- [ ] 540. =REPT("x",3) → xxx
- [ ] 541. =CHAR(65) → A
- [ ] 542. =CODE("A") → 65
- [ ] 543. =EXACT("a","a") → 1
- [ ] 544. =VALUE("42") → 42
- [ ] 545. =N(100) → 100
- [ ] 546. =SIGN(-5) → -1
- [ ] 547. =FACT(5) → 120
- [ ] 548. =PI() → π
- [ ] 549. =CHOOSE(2,"A","B","C") → B
- [ ] 550. =MEDIAN(1,2,3) → 2
- [ ] 551. =COUNT(1,2,3) → 3
- [ ] 552. =COUNTA(1,"x") → 2
- [ ] 553. =PRODUCT(2,3,4) → 24
- [ ] 554. =SUBSTITUTE("a-b","-",",") → a,b
- [ ] 555. =REPLACE("abc",2,1,"X") → aXc
- [ ] 556. =TEXTJOIN(",",0,"a","b") → a,b
- [ ] 557. =CLEAN("hi") → hi
- [ ] 558. =CONCAT("1","2") → 12
- [ ] 559. =MROUND(5,2) → 6
- [ ] 560. =XOR(1,0) → 1
- [ ] 561. =IFS(1,"a",0,"b") → a
- [ ] 562. Formula with space: = 1 + 2 works or trimmed
- [ ] 563. Invalid formula: shows #ERROR! or #NAME?
- [ ] 564. =SUM() → 0
- [ ] 565. =AVERAGE() → 0
- [ ] 566. Division by zero: handled
- [ ] 567. SQRT(-1): 0 or error
- [ ] 568. Nested functions: =ROUND(SQRT(4),1) → 2
- [ ] 569. Chain refs: A1=1, B1=A1*2, C1=B1+1
- [ ] 570. TRUE() → 1, FALSE() → 0
- [ ] 571–600. (Reserve: more functions, edge cases, sheet eval order)

---

## 7. Upload & open (Points 601–680)

- [ ] 601. Click Open: file dialog or drop zone
- [ ] 602. Select valid CSV: upload starts
- [ ] 603. Upload completes without error
- [ ] 604. Grid shows CSV data
- [ ] 605. CSV columns correct
- [ ] 606. CSV rows correct
- [ ] 607. CSV encoding UTF-8: correct
- [ ] 608. Select valid XLSX: upload starts
- [ ] 609. XLSX first sheet loaded
- [ ] 610. XLSX data in grid
- [ ] 611. Select valid XLS: upload works
- [ ] 612. Unsupported file type: error message
- [ ] 613. Cancel file dialog: no error
- [ ] 614. Very small CSV (1 cell): works
- [ ] 615. Large CSV (e.g. 5k rows): works or clear error
- [ ] 616. Empty CSV: handled
- [ ] 617. CSV with BOM: works
- [ ] 618. CSV with comma delimiter: correct
- [ ] 619. CSV with quoted fields: correct
- [ ] 620. After upload: project name in ribbon
- [ ] 621. After upload: switched to Sheets tab
- [ ] 622. After upload: can Save
- [ ] 623. After upload: can Export
- [ ] 624. Upload same file again: new project or overwrite per design
- [ ] 625. Upload during save: no crash
- [ ] 626. Network error during upload: user message
- [ ] 627. Backend down: upload shows error
- [ ] 628. File 0 bytes: error or empty grid
- [ ] 629. File &gt; 50MB: error or limit message
- [ ] 630. Drag-drop file (if implemented): works
- [ ] 631–680. (Reserve: more file types, encodings, malformed files)

---

## 8. Save (Points 681–730)

- [ ] 681. Save with no project: disabled or error
- [ ] 682. Save after upload: succeeds
- [ ] 683. Save updates project on disk
- [ ] 684. Save shows feedback (Saving/Saved)
- [ ] 685. Save error: message shown
- [ ] 686. Save twice: no duplicate write
- [ ] 687. Save with formula: stores display value or formula per design
- [ ] 688. Save with empty cells: correct
- [ ] 689. Save then open project: data matches
- [ ] 690. Save then export: export matches saved data
- [ ] 691–730. (Reserve: concurrent save, large data, backend down)

---

## 9. Export (Points 731–780)

- [ ] 731. Export XLSX: file downloads
- [ ] 732. Export XLSX: filename reasonable
- [ ] 733. Export XLSX: open in Excel shows data
- [ ] 734. Export CSV: file downloads
- [ ] 735. Export CSV: UTF-8
- [ ] 736. Export CSV: open in editor correct
- [ ] 737. Export with no project: uses current grid
- [ ] 738. Export with project: uses project data
- [ ] 739. Export error: message shown
- [ ] 740. Export twice: both work
- [ ] 741–780. (Reserve: special chars, large export, format options)

---

## 10. Projects tab (Points 781–880)

- [ ] 781. **Screenshot: 09-projects-list.png** — Projects list
- [ ] 782. "Projects" heading visible
- [ ] 783. "Recent" section when recent exist
- [ ] 784. "All projects" or "All" section
- [ ] 785. List shows project names
- [ ] 786. Open button per project
- [ ] 787. Rename button per project
- [ ] 788. Delete button per project
- [ ] 789. Click Open: loads project into grid
- [ ] 790. After open: switched to Sheets
- [ ] 791. After open: grid shows project data
- [ ] 792. Click Rename: inline edit or dialog
- [ ] 793. Submit rename: name updates
- [ ] 794. Cancel rename: name unchanged
- [ ] 795. Click Delete: confirmation
- [ ] 796. Confirm delete: project removed from list
- [ ] 797. Cancel delete: project remains
- [ ] 798. Delete current project: grid cleared or switched
- [ ] 799. No projects: empty state message
- [ ] 800. Loading state: spinner or skeleton
- [ ] 801. Load error: retry or message
- [ ] 802. Retry: reloads list
- [ ] 803. List scrolls if many projects
- [ ] 804. Recent order: last opened first
- [ ] 805. Open from recent: same as Open from All
- [ ] 806. Keyboard: focus in list
- [ ] 807. Enter on Open: opens project
- [ ] 808. Accessibility: list announced
- [ ] 809–880. (Reserve: many projects, long names, special chars, errors)

---

## 11. Settings tab (Points 881–930)

- [ ] 881. Settings heading visible
- [ ] 882. Theme or theme info shown
- [ ] 883. Workspace path or info shown
- [ ] 884. No broken layout
- [ ] 885. Readable text
- [ ] 886–930. (Reserve: future settings, toggles, persistence)

---

## 12. Keyboard & accessibility (Points 931–980)

- [ ] 931. Tab through all focusable elements
- [ ] 932. No focus trap
- [ ] 933. Focus visible (outline or ring)
- [ ] 934. Skip link (if any)
- [ ] 935. Heading hierarchy
- [ ] 936. Buttons have accessible names
- [ ] 937. Images have alt or aria-hidden
- [ ] 938. Form inputs have labels
- [ ] 939. Error messages associated
- [ ] 940. Color not only indicator
- [ ] 941–980. (Reserve: full a11y audit, screen reader, zoom)

---

## 13. Error handling & robustness (Points 981–1000)

- [ ] 981. Backend down: graceful message
- [ ] 982. Invalid API response: no white screen
- [ ] 983. React error boundary: fallback UI
- [ ] 984. Try again after error: retry works
- [ ] 985. Network timeout: message
- [ ] 986. 404 from API: handled
- [ ] 987. 500 from API: handled
- [ ] 988. Invalid JSON: handled
- [ ] 989. Corrupted project file: error not crash
- [ ] 990. Very long input: no hang
- [ ] 991. Rapid clicks: no crash
- [ ] 992. Reload during save: no corruption
- [ ] 993. Two tabs same app: both work or documented
- [ ] 994. LocalStorage full: graceful
- [ ] 995. Disk full (backend): error message
- [ ] 996. Permission denied (backend): error
- [ ] 997. Browser back: no crash
- [ ] 998. Restore session (if implemented)
- [ ] 999. Logs: no sensitive data in console
- [ ] 1000. All 505 unit tests pass; E2E tests pass when backend is up.

---

**How to run automated screenshot flow**

1. Start app: from project root run `npm run dev` (or `start.bat` on Windows). Wait until you see "Local: http://localhost:5173".
2. In another terminal: `cd frontend && npm run test:e2e -- e2e/everyday-usage.spec.ts`
3. On success, screenshots appear in `frontend/e2e-screenshots/` (01-initial-load.png through 11-after-export-csv.png).
4. On failure, see `frontend/test-results/` for failure screenshot and video.

**Manual simulation (if E2E fails or you prefer)**  
Start the app, open http://localhost:5173, and work through the guide step-by-step. Take your own screenshots at the points marked **Screenshot:** in the guide.

**Total: 1000 checkpoints.**
