import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import type { CellValue } from '../utils/gridData';
import { getColumnCount, colIndexToLetter } from '../utils/gridData';
import { getDefaultSheetData } from '../utils/sheetDefaults';
import { evaluateSheet } from '../utils/formulaParser';
import { SpreadsheetGrid, type SpreadsheetGridRefHandle } from './SpreadsheetGrid';

interface SheetTabProps {
  data: CellValue[][];
  onChange: (data: CellValue[][]) => void;
}

export function SheetTab({ data, onChange }: SheetTabProps) {
  const rawData = data.length > 0 ? data : getDefaultSheetData();
  const columnCount = getColumnCount(rawData);
  const displayData = useMemo(() => evaluateSheet(rawData), [rawData]);
  const prevDisplayRef = useRef<CellValue[][]>(displayData);
  const gridRef = useRef<SpreadsheetGridRefHandle>(null);
  const [pendingRefocus, setPendingRefocus] = useState<{
    row: number;
    col: number;
    expectedFormula: string;
  } | null>(null);

  const handleGridChange = (newDisplay: CellValue[][]) => {
    const prev = prevDisplayRef.current;
    let changed = false;
    const nextRaw = rawData.map((row, r) =>
      Array.from({ length: columnCount }, (_, c) => {
        const newVal = newDisplay[r]?.[c];
        const oldVal = prev[r]?.[c];
        if (newVal !== oldVal) {
          changed = true;
          return newVal;
        }
        return row[c] ?? null;
      })
    );
    if (changed) {
      prevDisplayRef.current = newDisplay;
      onChange(nextRaw);
    }
  };

  /** Excel-like: when editing a formula cell, clicking another cell inserts that cell ref */
  const handleActiveCellChange = useCallback(
    (
      from: { row: number; col: number } | null,
      to: { row: number; col: number } | null,
      fromCellCurrentValue?: string
    ) => {
      if (!from || !to || (from.row === to.row && from.col === to.col)) return;
      const raw = rawData[from.row]?.[from.col];
      const rawStr =
        (fromCellCurrentValue !== undefined && fromCellCurrentValue !== ''
          ? fromCellCurrentValue
          : raw !== null && raw !== undefined
            ? String(raw).trim()
            : ''
        ).trim();
      if (!rawStr.startsWith('=')) return;

      const refStr = colIndexToLetter(to.col) + (to.row + 1);
      const separator = /[,(]$/.test(rawStr) || rawStr === '=' ? '' : ',';
      const newRawStr = rawStr + separator + refStr;
      const nextRaw = rawData.map((row, r) =>
        r === from.row
          ? Array.from({ length: columnCount }, (_, c) =>
              c === from.col ? newRawStr : (row[c] ?? null)
            )
          : Array.from({ length: columnCount }, (_, c) => row[c] ?? null)
      );
      onChange(nextRaw);
      setPendingRefocus({ row: from.row, col: from.col, expectedFormula: newRawStr });
    },
    [rawData, columnCount, onChange]
  );

  useEffect(() => {
    if (!pendingRefocus) return;
    const current = rawData[pendingRefocus.row]?.[pendingRefocus.col];
    const match =
      current !== null &&
      current !== undefined &&
      String(current).trim() === pendingRefocus.expectedFormula;
    if (match) {
      const { row, col } = pendingRefocus;
      setPendingRefocus(null);
      const id = setTimeout(() => {
        gridRef.current?.setActiveCell({ row, col });
      }, 0);
      return () => clearTimeout(id);
    }
  }, [rawData, pendingRefocus]);

  return (
    <div className="sheet-tab">
      <SpreadsheetGrid
        ref={gridRef}
        data={displayData}
        onChange={handleGridChange}
        columnCount={columnCount}
        rawData={rawData}
        onActiveCellChange={handleActiveCellChange}
      />
    </div>
  );
}
