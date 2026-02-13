import * as XLSX from 'xlsx';

export type CellValue = string | number | null;

/**
 * Parse CSV buffer to 2D array (row-major). Uses SheetJS.
 */
export function parseCsv(buffer: Buffer): CellValue[][] {
  const wb = XLSX.read(buffer, { type: 'buffer', raw: true });
  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = wb.Sheets[firstSheetName];
  const data = XLSX.utils.sheet_to_json<CellValue[]>(sheet, {
    header: 1,
    defval: null,
    raw: false,
  }) as CellValue[][];
  return data;
}

/**
 * Parse XLSX/XLS buffer to 2D array (first sheet only).
 */
export function parseXlsxOrXls(buffer: Buffer): CellValue[][] {
  const wb = XLSX.read(buffer, { type: 'buffer', raw: false });
  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = wb.Sheets[firstSheetName];
  const data = XLSX.utils.sheet_to_json<CellValue[]>(sheet, {
    header: 1,
    defval: null,
    raw: false,
  }) as CellValue[][];
  return data;
}

export function isCsvFilename(filename: string): boolean {
  return /\.csv$/i.test(filename);
}

export function isXlsxFilename(filename: string): boolean {
  return /\.xlsx$/i.test(filename);
}

export function isXlsFilename(filename: string): boolean {
  return /\.xls$/i.test(filename) && !/\.xlsx$/i.test(filename);
}
