/** Parse "A1" -> { col: 0, row: 0 }, "B10" -> { col: 1, row: 9 } */
export function parseCellRef(ref: string): { col: number; row: number } | null {
  const m = ref.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!m) return null;
  const col = letterToColIndex(m[1]);
  const row = parseInt(m[2], 10) - 1;
  return col >= 0 && row >= 0 ? { col, row } : null;
}

/** Parse "A1:B10" -> { start: {col, row}, end: {col, row} } */
export function parseRange(ref: string): { start: { col: number; row: number }; end: { col: number; row: number } } | null {
  const parts = ref.split(':');
  if (parts.length !== 2) return null;
  const start = parseCellRef(parts[0].trim());
  const end = parseCellRef(parts[1].trim());
  if (!start || !end) return null;
  return {
    start: { col: Math.min(start.col, end.col), row: Math.min(start.row, end.row) },
    end: { col: Math.max(start.col, end.col), row: Math.max(start.row, end.row) },
  };
}

function letterToColIndex(letters: string): number {
  let n = 0;
  for (let i = 0; i < letters.length; i++) {
    n = n * 26 + (letters.charCodeAt(i) - 64);
  }
  return n - 1;
}

export function colLetterToIndex(letters: string): number {
  return letterToColIndex(letters.toUpperCase());
}
