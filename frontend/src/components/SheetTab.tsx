import { useMemo, useRef, useCallback, useState } from 'react';
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
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

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
      setActiveCell(to);
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
      // Sync prevDisplayRef so handleGridChange won't overwrite the formula
      prevDisplayRef.current = evaluateSheet(nextRaw);
      onChange(nextRaw);
    },
    [rawData, columnCount, onChange]
  );

  // Compute formula bar text: show raw formula for active cell
  const formulaBarText = useMemo(() => {
    if (!activeCell) return '';
    const raw = rawData[activeCell.row]?.[activeCell.col];
    return raw !== null && raw !== undefined ? String(raw) : '';
  }, [activeCell, rawData]);

  return (
    <div className="sheet-tab">
      <div className="formula-bar">
        <span className="formula-bar-label">
          {activeCell ? colIndexToLetter(activeCell.col) + (activeCell.row + 1) : ''}
        </span>
        <span className="formula-bar-separator" />
        <span className="formula-bar-fx">fx</span>
        <input
          className="formula-bar-input"
          value={formulaBarText}
          readOnly
          tabIndex={-1}
          placeholder="Select a cell"
        />
      </div>
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
