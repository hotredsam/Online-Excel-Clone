import { parseCellRef, parseRange } from './cellRef';
import type { CellValue } from './gridData';

export type EvalContext = {
  getCell: (row: number, col: number) => CellValue;
  currentRow: number;
  currentCol: number;
};

function toNum(v: CellValue): number {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function toStr(v: CellValue): string {
  if (v === null || v === undefined) return '';
  return String(v);
}

export const formulaFunctions: Record<string, (args: CellValue[], ctx: EvalContext) => CellValue> = {
  SUM: (args, ctx) => {
    let sum = 0;
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) sum += toNum(ctx.getCell(row, col));
      } else if (typeof a === 'string' && parseCellRef(a)) {
        const c = parseCellRef(a)!;
        sum += toNum(ctx.getCell(c.row, c.col));
      } else sum += toNum(a);
    }
    return sum;
  },
  AVERAGE: (args, ctx) => {
    const nums: number[] = [];
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col)));
      } else if (typeof a === 'string' && parseCellRef(a)) {
        const c = parseCellRef(a)!;
        nums.push(toNum(ctx.getCell(c.row, c.col)));
      } else nums.push(toNum(a));
    }
    return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
  },
  COUNT: (args, ctx) => {
    let n = 0;
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) if (ctx.getCell(row, col) !== null && ctx.getCell(row, col) !== '') n++;
      } else if (typeof a === 'string' && parseCellRef(a)) {
        const c = parseCellRef(a)!;
        if (ctx.getCell(c.row, c.col) !== null && ctx.getCell(c.row, c.col) !== '') n++;
      } else if (a !== null && a !== '') n++;
    }
    return n;
  },
  MIN: (args, ctx) => {
    const nums: number[] = [];
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col)));
      } else if (typeof a === 'string' && parseCellRef(a)) {
        const c = parseCellRef(a)!;
        nums.push(toNum(ctx.getCell(c.row, c.col)));
      } else nums.push(toNum(a));
    }
    return nums.length ? Math.min(...nums) : 0;
  },
  MAX: (args, ctx) => {
    const nums: number[] = [];
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col)));
      } else if (typeof a === 'string' && parseCellRef(a)) {
        const c = parseCellRef(a)!;
        nums.push(toNum(ctx.getCell(c.row, c.col)));
      } else nums.push(toNum(a));
    }
    return nums.length ? Math.max(...nums) : 0;
  },
  IF: (args, _ctx) => {
    const cond = args[0];
    const t = args[1];
    const f = args[2];
    const b = toNum(cond) !== 0 || (typeof cond === 'string' && cond.toUpperCase() === 'TRUE');
    return b ? (t ?? '') : (f ?? '');
  },
  AND: (args, _ctx) => {
    for (const a of args) if (toNum(a) === 0) return 0;
    return 1;
  },
  OR: (args, _ctx) => {
    for (const a of args) if (toNum(a) !== 0) return 1;
    return 0;
  },
  NOT: (args, _ctx) => (toNum(args[0]) !== 0 ? 0 : 1),
  TRUE: () => 1,
  FALSE: () => 0,
  CONCATENATE: (args, _ctx) => args.map(toStr).join(''),
  LEFT: (args, _ctx) => { const n = args[1] == null ? 1 : Math.max(0, toNum(args[1])); return toStr(args[0]).slice(0, n); },
  RIGHT: (args, _ctx) => {
    const s = toStr(args[0]);
    const n = Math.max(0, toNum(args[1]) || 1);
    return s.slice(-n);
  },
  MID: (args, _ctx) => {
    const s = toStr(args[0]);
    const start = Math.max(0, toNum(args[1]) - 1);
    const len = Math.max(0, toNum(args[2]) || 0);
    return s.slice(start, start + len);
  },
  LEN: (args, _ctx) => toStr(args[0]).length,
  ROUND: (args, _ctx) => Math.round(toNum(args[0]) * Math.pow(10, toNum(args[1]) || 0)) / Math.pow(10, toNum(args[1]) || 0),
  ROUNDUP: (args, _ctx) => Math.ceil(toNum(args[0]) * Math.pow(10, toNum(args[1]) || 0)) / Math.pow(10, toNum(args[1]) || 0),
  ROUNDDOWN: (args, _ctx) => Math.floor(toNum(args[0]) * Math.pow(10, toNum(args[1]) || 0)) / Math.pow(10, toNum(args[1]) || 0),
  ABS: (args, _ctx) => Math.abs(toNum(args[0])),
  SQRT: (args, _ctx) => {
    const n = toNum(args[0]);
    return n < 0 ? 0 : Math.sqrt(n);
  },
  MOD: (args, _ctx) => {
    const a = toNum(args[0]);
    const b = toNum(args[1]);
    return b === 0 ? 0 : a % b;
  },
  POWER: (args, _ctx) => Math.pow(toNum(args[0]), toNum(args[1])),
  INT: (args, _ctx) => Math.trunc(toNum(args[0])),
  FLOOR: (args, _ctx) => Math.floor(toNum(args[0])),
  CEILING: (args, _ctx) => Math.ceil(toNum(args[0])),
  SUMIF: (args, ctx) => {
    const rangeStr = toStr(args[0]);
    const criteria = args[1];
    const sumRangeStr = args[2] ? toStr(args[2]) : rangeStr;
    const r = parseRange(rangeStr);
    const sumR = parseRange(sumRangeStr);
    if (!r || !sumR) return 0;
    let sum = 0;
    const critNum = toNum(criteria);
    const critStr = toStr(criteria);
    const row = r.start.row;
    const col = r.start.col;
    const sumRow = sumR.start.row;
    const sumCol = sumR.start.col;
    for (let i = 0; i <= r.end.row - r.start.row; i++) {
      for (let j = 0; j <= r.end.col - r.start.col; j++) {
        const cell = ctx.getCell(row + i, col + j);
        const match = typeof criteria === 'string' && criteria.startsWith('>') ? toNum(cell) > critNum :
          typeof criteria === 'string' && criteria.startsWith('<') ? toNum(cell) < critNum :
            toNum(cell) === critNum || toStr(cell) === critStr;
        if (match) sum += toNum(ctx.getCell(sumRow + i, sumCol + j));
      }
    }
    return sum;
  },
  COUNTIF: (args, ctx) => {
    const rangeStr = toStr(args[0]);
    const criteria = args[1];
    const r = parseRange(rangeStr);
    if (!r) return 0;
    let n = 0;
    const critNum = toNum(criteria);
    const critStr = toStr(criteria);
    for (let row = r.start.row; row <= r.end.row; row++)
      for (let col = r.start.col; col <= r.end.col; col++) {
        const cell = ctx.getCell(row, col);
        if (toNum(cell) === critNum || toStr(cell) === critStr) n++;
      }
    return n;
  },
  AVERAGEIF: (args, ctx) => {
    const rangeStr = toStr(args[0]);
    const criteria = args[1];
    const avgRangeStr = args[2] ? toStr(args[2]) : rangeStr;
    const r = parseRange(rangeStr);
    const avgR = parseRange(avgRangeStr);
    if (!r || !avgR) return 0;
    let sum = 0; let count = 0;
    const critNum = toNum(criteria);
    const critStr = toStr(criteria);
    for (let i = 0; i <= r.end.row - r.start.row; i++) {
      for (let j = 0; j <= r.end.col - r.start.col; j++) {
        const cell = ctx.getCell(r.start.row + i, r.start.col + j);
        if (toNum(cell) === critNum || toStr(cell) === critStr) {
          sum += toNum(ctx.getCell(avgR.start.row + i, avgR.start.col + j));
          count++;
        }
      }
    }
    return count ? sum / count : 0;
  },
  VLOOKUP: (args, ctx) => {
    const lookupVal = args[0];
    const tableStr = toStr(args[1]);
    const colIndex = Math.max(1, Math.floor(toNum(args[2])));
    const range = parseRange(tableStr);
    if (!range) return '';
    const lastCol = range.end.col;
    const dataCol = range.start.col + colIndex - 1;
    if (dataCol > lastCol) return '';
    for (let row = range.start.row; row <= range.end.row; row++) {
      const key = ctx.getCell(row, range.start.col);
      if (toStr(key) === toStr(lookupVal) || toNum(key) === toNum(lookupVal))
        return ctx.getCell(row, dataCol);
    }
    return '';
  },
  INDEX: (args, ctx) => {
    const rangeStr = toStr(args[0]);
    const rowNum = Math.max(1, Math.floor(toNum(args[1])));
    const colNum = args[2] != null ? Math.max(1, Math.floor(toNum(args[2]))) : 1;
    const r = parseRange(rangeStr);
    if (!r) return '';
    return ctx.getCell(r.start.row + rowNum - 1, r.start.col + colNum - 1) ?? '';
  },
  MATCH: (args, ctx) => {
    const lookupVal = args[0];
    const rangeStr = toStr(args[1]);
    const r = parseRange(rangeStr);
    if (!r) return 0;
    for (let i = 0; i <= r.end.row - r.start.row; i++) {
      const cell = ctx.getCell(r.start.row + i, r.start.col);
      if (toStr(cell) === toStr(lookupVal) || toNum(cell) === toNum(lookupVal)) return i + 1;
    }
    return 0;
  },
  TODAY: () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  },
  NOW: () => new Date().toISOString(),
  UPPER: (args, _ctx) => toStr(args[0]).toUpperCase(),
  LOWER: (args, _ctx) => toStr(args[0]).toLowerCase(),
  TRIM: (args, _ctx) => toStr(args[0]).trim(),
  ISNUMBER: (args, _ctx) => {
    const v = args[0];
    if (typeof v === 'number' && !Number.isNaN(v)) return 1;
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return 1;
    return 0;
  },
  ISTEXT: (args, _ctx) => (typeof args[0] === 'string' ? 1 : 0),
  ISBLANK: (args, _ctx) => (args[0] === null || args[0] === '' || args[0] === undefined ? 1 : 0),
  PRODUCT: (args, ctx) => {
    let prod = 1;
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) prod *= toNum(ctx.getCell(row, col)) || 1;
      } else prod *= toNum(a) || 1;
    }
    return prod;
  },
  MEDIAN: (args, ctx) => {
    const nums: number[] = [];
    for (const a of args) {
      if (typeof a === 'string' && a.includes(':')) {
        const r = parseRange(a);
        if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col)));
      } else nums.push(toNum(a));
    }
    if (nums.length === 0) return 0;
    nums.sort((x, y) => x - y);
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },
  EXP: (args, _ctx) => Math.exp(toNum(args[0])),
  LN: (args, _ctx) => { const n = toNum(args[0]); return n <= 0 ? 0 : Math.log(n); },
  LOG: (args, _ctx) => { const n = toNum(args[0]); const base = args[1] != null ? toNum(args[1]) : 10; return n <= 0 || base <= 0 ? 0 : Math.log(n) / Math.log(base); },
  SIN: (args, _ctx) => Math.sin(toNum(args[0])),
  COS: (args, _ctx) => Math.cos(toNum(args[0])),
  TAN: (args, _ctx) => Math.tan(toNum(args[0])),
  PI: (_args, _ctx) => Math.PI,

  PROPER: (args, _ctx) => toStr(args[0]).replace(/\b\w/g, (c) => c.toUpperCase()),
  FIND: (args, _ctx) => { const findText = toStr(args[0]); const withinText = toStr(args[1]); const start = args[2] != null ? Math.max(0, toNum(args[2]) - 1) : 0; const i = withinText.indexOf(findText, start); return i < 0 ? 0 : i + 1; },
  SEARCH: (args, _ctx) => { const findText = toStr(args[0]).toLowerCase(); const withinText = toStr(args[1]).toLowerCase(); const start = args[2] != null ? Math.max(0, toNum(args[2]) - 1) : 0; const i = withinText.indexOf(findText, start); return i < 0 ? 0 : i + 1; },
  REPLACE: (args, _ctx) => { const s = toStr(args[0]); const start = Math.max(0, toNum(args[1]) - 1); const len = Math.max(0, toNum(args[2])); const newStr = toStr(args[3]); return s.slice(0, start) + newStr + s.slice(start + len); },
  SUBSTITUTE: (args, _ctx) => { let s = toStr(args[0]); const oldStr = toStr(args[1]); const newStr = toStr(args[2]); const n = args[3] != null ? toNum(args[3]) : 0; if (n <= 0) return s.split(oldStr).join(newStr); let i = 0; for (let k = 0; k < n; k++) { const j = s.indexOf(oldStr, i); if (j < 0) break; s = s.slice(0, j) + newStr + s.slice(j + oldStr.length); i = j + newStr.length; } return s; },
  IFERROR: (args, _ctx) => { const v = args[0]; if (v === '#ERROR!' || v === '#NAME?' || v === '#REF!' || v === '#VALUE!' || (typeof v === 'number' && (Number.isNaN(v) || !Number.isFinite(v)))) return args[1] ?? ''; return v; },
  IFNA: (args, _ctx) => (args[0] === '#N/A' || (typeof args[0] === 'string' && args[0].startsWith('#')) ? (args[1] ?? '') : args[0]),
  ROW: (args, ctx) => (args[0] != null && typeof args[0] === 'string' ? (parseCellRef(args[0])?.row ?? ctx.currentRow) + 1 : ctx.currentRow + 1),
  COLUMN: (args, ctx) => (args[0] != null && typeof args[0] === 'string' ? (parseCellRef(args[0])?.col ?? ctx.currentCol) + 1 : ctx.currentCol + 1),
  ROWS: (args, _ctx) => { const r = typeof args[0] === 'string' && args[0].includes(':') ? parseRange(args[0]) : null; return r ? r.end.row - r.start.row + 1 : 1; },
  COLUMNS: (args, _ctx) => { const r = typeof args[0] === 'string' && args[0].includes(':') ? parseRange(args[0]) : null; return r ? r.end.col - r.start.col + 1 : 1; },
  DATE: (args, _ctx) => { const y = Math.floor(toNum(args[0])); const m = Math.floor(toNum(args[1])); const d = Math.floor(toNum(args[2])); const dt = new Date(y, m - 1, d); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); },
  DAY: (args, _ctx) => { const s = toStr(args[0]); const dt = new Date(s); return Number.isNaN(dt.getTime()) ? 0 : dt.getDate(); },
  MONTH: (args, _ctx) => { const s = toStr(args[0]); const dt = new Date(s); return Number.isNaN(dt.getTime()) ? 0 : dt.getMonth() + 1; },
  YEAR: (args, _ctx) => { const s = toStr(args[0]); const dt = new Date(s); return Number.isNaN(dt.getTime()) ? 0 : dt.getFullYear(); },
  DATEDIF: (args, _ctx) => { const d1 = new Date(toStr(args[0])); const d2 = new Date(toStr(args[1])); const unit = toStr(args[2] || 'D').toUpperCase(); if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0; const diff = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)); if (unit === 'D') return diff; if (unit === 'M') return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()); if (unit === 'Y') return d2.getFullYear() - d1.getFullYear(); return diff; },
  HLOOKUP: (args, ctx) => { const lookupVal = args[0]; const tableStr = toStr(args[1]); const rowIndex = Math.max(1, Math.floor(toNum(args[2]))); const range = parseRange(tableStr); if (!range) return ''; const lastRow = range.end.row; const dataRow = range.start.row + rowIndex - 1; if (dataRow > lastRow) return ''; for (let col = range.start.col; col <= range.end.col; col++) { const key = ctx.getCell(range.start.row, col); if (toStr(key) === toStr(lookupVal) || toNum(key) === toNum(lookupVal)) return ctx.getCell(dataRow, col); } return ''; },
  CHOOSE: (args, _ctx) => { const i = Math.max(1, Math.floor(toNum(args[0]))) - 1; return args[i + 1] ?? ''; },
  SUMIFS: (args, ctx) => { const sumR = parseRange(toStr(args[0])); if (!sumR) return 0; const rowCount = sumR.end.row - sumR.start.row + 1; let sum = 0; for (let i = 0; i < rowCount; i++) { let match = true; for (let j = 1; j < args.length; j += 2) { const r = parseRange(toStr(args[j])); const crit = args[j + 1]; if (r && r.start.row + i <= r.end.row) { const cell = ctx.getCell(r.start.row + i, r.start.col); match = match && (toNum(cell) === toNum(crit) || toStr(cell) === toStr(crit)); } } if (match) sum += toNum(ctx.getCell(sumR.start.row + i, sumR.start.col)); } return sum; },
  COUNTIFS: (args, ctx) => { const firstR = parseRange(toStr(args[0])); if (!firstR) return 0; const rowCount = firstR.end.row - firstR.start.row + 1; let n = 0; for (let i = 0; i < rowCount; i++) { let match = true; for (let j = 0; j < args.length; j += 2) { const r = parseRange(toStr(args[j])); const crit = args[j + 1]; if (r && r.start.row + i <= r.end.row) { const cell = ctx.getCell(r.start.row + i, r.start.col); match = match && (toNum(cell) === toNum(crit) || toStr(cell) === toStr(crit)); } } if (match) n++; } return n; },
  AVERAGEIFS: (args, ctx) => { const avgRangeStr = toStr(args[0]); const avgR = parseRange(avgRangeStr); if (!avgR) return 0; let sum = 0; let count = 0; for (let i = 0; i <= avgR.end.row - avgR.start.row; i++) { let match = true; for (let j = 1; j < args.length; j += 2) { const r = parseRange(toStr(args[j])); const crit = args[j + 1]; if (r && r.start.row + i <= r.end.row) { const cell = ctx.getCell(r.start.row + i, r.start.col); match = match && (toNum(cell) === toNum(crit) || toStr(cell) === toStr(crit)); } } if (match) { sum += toNum(ctx.getCell(avgR.start.row + i, avgR.start.col)); count++; } } return count ? sum / count : 0; },
  SUMPRODUCT: (args, ctx) => { const ranges = args.map((a) => typeof a === 'string' && a.includes(':') ? parseRange(a) : null); if (ranges.some((r) => !r)) return 0; const n = ranges[0]!.end.row - ranges[0]!.start.row + 1; const m = ranges[0]!.end.col - ranges[0]!.start.col + 1; let sum = 0; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { let prod = 1; for (const r of ranges) prod *= toNum(ctx.getCell(r!.start.row + i, r!.start.col + j)); sum += prod; } return sum; },
  COUNTA: (args, ctx) => { let n = 0; for (const a of args) { if (typeof a === 'string' && a.includes(':')) { const r = parseRange(a); if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) if (ctx.getCell(row, col) !== null && ctx.getCell(row, col) !== '') n++; } else if (a !== null && a !== '') n++; } return n; },
  ISERROR: (args, _ctx) => { const v = args[0]; return (typeof v === 'string' && v.startsWith('#')) || (typeof v === 'number' && Number.isNaN(v)) ? 1 : 0; },
  ISNA: (args, _ctx) => (args[0] === '#N/A' || (typeof args[0] === 'string' && args[0].includes('N/A')) ? 1 : 0),
  LARGE: (args, ctx) => { const rangeStr = toStr(args[0]); const k = Math.max(1, Math.floor(toNum(args[1]))); const r = parseRange(rangeStr); if (!r) return 0; const nums: number[] = []; for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col))); nums.sort((a, b) => b - a); return nums[k - 1] ?? 0; },
  SMALL: (args, ctx) => { const rangeStr = toStr(args[0]); const k = Math.max(1, Math.floor(toNum(args[1]))); const r = parseRange(rangeStr); if (!r) return 0; const nums: number[] = []; for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col))); nums.sort((a, b) => a - b); return nums[k - 1] ?? 0; },
  SIGN: (args, _ctx) => { const n = toNum(args[0]); return n > 0 ? 1 : n < 0 ? -1 : 0; },
  FACT: (args, _ctx) => { const n = Math.max(0, Math.floor(toNum(args[0]))); let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; },
  RAND: (_args, _ctx) => Math.random(),
  RANDBETWEEN: (args, _ctx) => { const lo = Math.floor(toNum(args[0])); const hi = Math.floor(toNum(args[1])); return Math.floor(lo + Math.random() * (hi - lo + 1)); },
  CHAR: (args, _ctx) => String.fromCharCode(Math.max(0, Math.min(65535, Math.floor(toNum(args[0]))))),
  CODE: (args, _ctx) => (toStr(args[0]).length ? toStr(args[0]).charCodeAt(0) : 0),
  TEXTJOIN: (args, _ctx) => { const delim = toStr(args[0]); const ignoreEmpty = toNum(args[1]) !== 0; const parts = args.slice(2).map(toStr).filter((p) => !ignoreEmpty || p !== ''); return parts.join(delim); },
  REPT: (args, _ctx) => toStr(args[0]).repeat(Math.max(0, Math.floor(toNum(args[1])))),
  EXACT: (args, _ctx) => toStr(args[0]) === toStr(args[1]) ? 1 : 0,
  VALUE: (args, _ctx) => { const n = Number(toStr(args[0]).replace(/[^\d.-]/g, '')); return Number.isNaN(n) ? 0 : n; },
  FIXED: (args, _ctx) => toNum(args[0]).toFixed(args[1] != null ? Math.max(0, Math.min(20, Math.floor(toNum(args[1])))) : 2),
  STDEV: (args, ctx) => { const nums: number[] = []; for (const a of args) { if (typeof a === 'string' && a.includes(':')) { const r = parseRange(a); if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col))); } else nums.push(toNum(a)); } if (nums.length < 2) return 0; const avg = nums.reduce((s, n) => s + n, 0) / nums.length; const variance = nums.reduce((s, n) => s + (n - avg) ** 2, 0) / (nums.length - 1); return Math.sqrt(variance); },
  VAR: (args, ctx) => { const nums: number[] = []; for (const a of args) { if (typeof a === 'string' && a.includes(':')) { const r = parseRange(a); if (r) for (let row = r.start.row; row <= r.end.row; row++) for (let col = r.start.col; col <= r.end.col; col++) nums.push(toNum(ctx.getCell(row, col))); } else nums.push(toNum(a)); } if (nums.length < 2) return 0; const avg = nums.reduce((s, n) => s + n, 0) / nums.length; return nums.reduce((s, n) => s + (n - avg) ** 2, 0) / (nums.length - 1); },
  'FLOOR.MATH': (args, _ctx) => Math.floor(toNum(args[0])),
  'CEILING.MATH': (args, _ctx) => Math.ceil(toNum(args[0])),
  IFS: (args, _ctx) => { for (let i = 0; i < args.length - 1; i += 2) if (toNum(args[i]) !== 0) return args[i + 1] ?? ''; return args[args.length - 1] ?? ''; },
  XOR: (args, _ctx) => { let t = 0; for (const a of args) if (toNum(a) !== 0) t++; return (t % 2 === 1) ? 1 : 0; },
  CONCAT: (args, _ctx) => args.map(toStr).join(''),
  CLEAN: (args, _ctx) => toStr(args[0]).replace(/[\u0000-\u001F\u007F]/g, ''),
  EOMONTH: (args, _ctx) => { const d = new Date(toStr(args[0])); const months = Math.floor(toNum(args[1])); d.setMonth(d.getMonth() + months); const last = new Date(d.getFullYear(), d.getMonth() + 1, 0); return last.getFullYear() + '-' + String(last.getMonth() + 1).padStart(2, '0') + '-' + String(last.getDate()).padStart(2, '0'); },
  EDATE: (args, _ctx) => { const d = new Date(toStr(args[0])); d.setMonth(d.getMonth() + Math.floor(toNum(args[1]))); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  WEEKDAY: (args, _ctx) => { const d = new Date(toStr(args[0])); const type = args[1] != null ? toNum(args[1]) : 1; const day = d.getDay(); if (type === 1) return day === 0 ? 7 : day; if (type === 2) return day + 1; return day; },
  MROUND: (args, _ctx) => { const n = toNum(args[0]); const m = toNum(args[1]); return m === 0 ? 0 : Math.round(n / m) * m; },
  N: (args, _ctx) => { const v = args[0]; if (typeof v === 'number') return v; if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v); return 0; },
};
