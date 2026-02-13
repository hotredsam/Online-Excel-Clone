import type { CellValue } from './gridData';
import { DEFAULT_COLS, DEFAULT_ROWS } from './gridData';

/** Default empty grid for first load (per PLAN data model) */
export function getDefaultSheetData(): CellValue[][] {
  return Array.from({ length: DEFAULT_ROWS }, () =>
    Array.from({ length: DEFAULT_COLS }, () => null)
  );
}
