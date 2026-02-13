import { parseCellRef, parseRange } from './cellRef';
import { formulaFunctions, type EvalContext } from './formulaFunctions';
import type { CellValue } from './gridData';

/** Evaluate a formula string with given context. Returns computed value or #ERROR! on failure. */
export function evaluateFormula(
  formula: string,
  ctx: EvalContext
): CellValue {
  const s = formula.trim();
  if (!s.startsWith('=')) return s;
  const expr = s.slice(1).trim();
  if (!expr) return '';
  try {
    return parseAndEvaluate(expr, ctx);
  } catch {
    return '#ERROR!';
  }
}

function parseAndEvaluate(expr: string, ctx: EvalContext): CellValue {
  let i = 0;
  function skipWs() {
    while (i < expr.length && /[\s,]/.test(expr[i])) i++;
  }
  function parseArg(): CellValue {
    skipWs();
    if (i >= expr.length) return null;
    if (expr[i] === '"') {
      i++;
      let s = '';
      while (i < expr.length && expr[i] !== '"') {
        if (expr[i] === '\\') i++;
        s += expr[i++];
      }
      if (expr[i] === '"') i++;
      return s;
    }
    const start = i;
    if (/[A-Za-z]/.test(expr[i])) {
      let name = '';
      while (i < expr.length && /[A-Za-z0-9.:]/.test(expr[i])) name += expr[i++];
      if (expr[i] === '(') {
        i++;
        const args: CellValue[] = [];
        skipWs();
        while (i < expr.length && expr[i] !== ')') {
          args.push(parseCompare());
          skipWs();
          if (expr[i] === ',') i++;
        }
        if (expr[i] === ')') i++;
        const fn = formulaFunctions[name.toUpperCase()];
        if (fn) return fn(args, ctx);
        return '#NAME?';
      }
      if (name.toUpperCase() === 'TRUE') return 1;
      if (name.toUpperCase() === 'FALSE') return 0;
      if (name.includes(':')) {
        const r = parseRange(name);
        if (r) return name;
      }
      const cell = parseCellRef(name);
      if (cell) return ctx.getCell(cell.row, cell.col);
      return '#REF!';
    }
    if (expr[i] === '-' || expr[i] === '+') {
      const sign = expr[i++] === '-' ? -1 : 1;
      skipWs();
      const n = parseArg();
      return toNum(n) * sign;
    }
    if (/[0-9.]/.test(expr[i])) {
      while (i < expr.length && /[0-9.]/.test(expr[i])) i++;
      if (i < expr.length && /[eE]/.test(expr[i])) {
        i++;
        if (expr[i] === '+' || expr[i] === '-') i++;
        while (i < expr.length && /[0-9]/.test(expr[i])) i++;
      }
      const num = Number(expr.slice(start, i));
      return Number.isNaN(num) ? 0 : num;
    }
    if (expr[i] === '(') {
      i++;
      const v = parseCompare();
      skipWs();
      if (expr[i] === ')') i++;
      return v;
    }
    return null;
  }
  function toNum(v: CellValue): number {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (Array.isArray(v)) return (v as number[]).reduce((s, n) => s + Number(n), 0);
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  function parseCompare(): CellValue {
    const left = parseAddSub();
    skipWs();
    const op = expr.slice(i, i + 2);
    if (op === '>=' || op === '<=' || op === '<>') {
      i += 2;
      const right = parseAddSub();
      if (op === '>=') return toNum(left) >= toNum(right) ? 1 : 0;
      if (op === '<=') return toNum(left) <= toNum(right) ? 1 : 0;
      return toNum(left) !== toNum(right) ? 1 : 0;
    }
    if (expr[i] === '=' || expr[i] === '>' || expr[i] === '<') {
      const c = expr[i++];
      const right = parseAddSub();
      if (c === '=') return toNum(left) === toNum(right) ? 1 : 0;
      if (c === '>') return toNum(left) > toNum(right) ? 1 : 0;
      return toNum(left) < toNum(right) ? 1 : 0;
    }
    return left;
  }
  function parseAddSub(): CellValue {
    let left = parseMulDiv();
    while (i < expr.length) {
      skipWs();
      if (expr[i] === '+') {
        i++;
        left = toNum(left) + toNum(parseMulDiv());
      } else if (expr[i] === '-') {
        i++;
        left = toNum(left) - toNum(parseMulDiv());
      } else if (expr[i] === '&') {
        i++;
        left = String(left ?? '') + String(parseMulDiv() ?? '');
      } else break;
    }
    return left;
  }
  function parseMulDiv(): CellValue {
    let left = parseUnary();
    while (i < expr.length) {
      skipWs();
      if (expr[i] === '*') {
        i++;
        left = toNum(left) * toNum(parseUnary());
      } else if (expr[i] === '/') {
        i++;
        const r = toNum(parseUnary());
        if (r === 0) {
          const l = toNum(left);
          left = l === 0 ? NaN : (l > 0 ? Infinity : -Infinity);
        } else {
          left = toNum(left) / r;
        }
      } else if (expr[i] === '^') {
        i++;
        left = Math.pow(toNum(left), toNum(parseUnary()));
      } else break;
    }
    return left;
  }
  function parseUnary(): CellValue {
    skipWs();
    if (expr[i] === '-') {
      i++;
      return -toNum(parseUnary());
    }
    if (expr[i] === '+') {
      i++;
      return parseUnary();
    }
    return parseArg();
  }
  return parseCompare();
}

/** Build evaluated grid from raw data (formulas evaluated). Uses lazy getCell to resolve refs. */
export function evaluateSheet(rawData: CellValue[][]): CellValue[][] {
  const rows = rawData.length;
  const cols = Math.max(0, ...rawData.map((r) => r.length));
  const out: (CellValue | undefined)[][] = Array.from({ length: rows }, () => []);
  const visited = new Set<number>();
  const getCell = (row: number, col: number): CellValue => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
    if (out[row][col] !== undefined) return out[row][col] ?? null;
    const key = row * 10000 + col;
    if (visited.has(key)) return rawData[row]?.[col] ?? null;
    visited.add(key);
    const raw = rawData[row]?.[col];
    if (raw !== null && raw !== undefined && typeof raw === 'string' && raw.trim().startsWith('=')) {
      try {
        out[row][col] = evaluateFormula(raw, { getCell, currentRow: row, currentCol: col });
      } catch {
        out[row][col] = '#ERROR!';
      }
    } else {
      out[row][col] = raw;
    }
    return out[row][col] ?? null;
  };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) getCell(r, c);
  return out as CellValue[][];
}
