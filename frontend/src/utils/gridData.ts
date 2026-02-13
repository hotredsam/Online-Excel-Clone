/** Convert column index to Excel-style letter(s): 0 -> A, 25 -> Z, 26 -> AA */
export function colIndexToLetter(index: number): string {
  let result = '';
  let n = index;
  do {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return result;
}

export const DEFAULT_COLS = 26;
export const DEFAULT_ROWS = 100;

export type CellValue = string | number | null;

/** Row object format for react-datasheet-grid: keys are string column indices */
export type GridRow = Record<string, string | number | null>;

/** Convert 2D array to grid value (array of row objects) */
export function dataToGridValue(
  data: CellValue[][],
  columnCount: number
): GridRow[] {
  if (data.length === 0) {
    return Array.from({ length: DEFAULT_ROWS }, () =>
      Object.fromEntries(
        Array.from({ length: columnCount }, (_, j) => [String(j), null])
      )
    );
  }
  return data.map((row) =>
    Object.fromEntries(
      Array.from({ length: columnCount }, (_, j) => [
        String(j),
        row[j] ?? null,
      ])
    )
  );
}

/** Convert grid value back to 2D array */
export function gridValueToData(
  value: GridRow[],
  columnCount: number
): CellValue[][] {
  return value.map((row) =>
    Array.from({ length: columnCount }, (_, j) => row[String(j)] ?? null)
  );
}

/** Infer column count from 2D data (max row length, at least 1) */
export function getColumnCount(data: CellValue[][]): number {
  if (data.length === 0) return DEFAULT_COLS;
  return Math.max(DEFAULT_COLS, ...data.map((row) => row.length));
}
