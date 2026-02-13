import { useMemo, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  DataSheetGrid,
  keyColumn,
  textColumn,
  type DataSheetGridRef,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import {
  colIndexToLetter,
  type CellValue,
  type GridRow,
  dataToGridValue,
  gridValueToData,
  getColumnCount,
} from '../utils/gridData';
import { createFormulaColumn } from '../utils/formulaColumnFactory';

export interface SpreadsheetGridRefHandle {
  setActiveCell: DataSheetGridRef['setActiveCell'];
}

interface SpreadsheetGridProps {
  data: CellValue[][];
  onChange: (data: CellValue[][]) => void;
  columnCount?: number;
  /** When provided, cells show formula when focused and support click-to-insert ref */
  rawData?: CellValue[][];
  /** Called when active cell changes; (fromCell, toCell, fromCellCurrentValue?) for click-to-insert ref */
  onActiveCellChange?: (
    from: { row: number; col: number } | null,
    to: { row: number; col: number } | null,
    fromCellCurrentValue?: string
  ) => void;
}

export const SpreadsheetGrid = forwardRef<SpreadsheetGridRefHandle, SpreadsheetGridProps>(
  function SpreadsheetGrid(
    { data, onChange, columnCount: columnCountProp, rawData, onActiveCellChange },
    ref
  ) {
    const columnCount = columnCountProp ?? getColumnCount(data);
    const gridRef = useRef<DataSheetGridRef>(null);
    const prevCellRef = useRef<{ row: number; col: number } | null>(null);
    const uncommittedRef = useRef<Record<string, string>>({});

    const setUncommitted = useCallback((row: number, col: number, value: string) => {
      uncommittedRef.current[`${row},${col}`] = value;
    }, []);

    useImperativeHandle(ref, () => ({
      setActiveCell: (cell) => gridRef.current?.setActiveCell(cell),
    }));

    const getRaw = useMemo(
      () =>
        rawData
          ? (row: number, col: number) => rawData[row]?.[col] ?? null
          : () => null,
      [rawData]
    );

    const columns = useMemo(
      () =>
        Array.from({ length: columnCount }, (_, i) => ({
          ...keyColumn(
            String(i),
            rawData ? createFormulaColumn({ getRaw, setUncommitted }) : textColumn
          ),
          title: colIndexToLetter(i),
        })),
      [columnCount, rawData, getRaw, setUncommitted]
    );

    const value = useMemo(
      () => dataToGridValue(data, columnCount),
      [data, columnCount]
    );

    const handleChange = (newValue: GridRow[]) => {
      onChange(gridValueToData(newValue, columnCount));
    };

    const handleActiveCellChange = (opts: { cell: { row: number; col: number } | null }) => {
      const toCell = opts.cell;
      const fromCell = prevCellRef.current;
      if (fromCell && toCell && onActiveCellChange) {
        const key = `${fromCell.row},${fromCell.col}`;
        const fromCellCurrentValue = uncommittedRef.current[key] ?? null;
        if (fromCellCurrentValue !== null) {
          delete uncommittedRef.current[key];
        }
        onActiveCellChange(fromCell, toCell, fromCellCurrentValue ?? undefined);
      }
      prevCellRef.current = toCell;
    };

    return (
      <div className="spreadsheet-grid-wrap">
        <DataSheetGrid
          ref={gridRef}
          value={value}
          onChange={handleChange}
          columns={columns}
          onActiveCellChange={handleActiveCellChange}
        />
      </div>
    );
  }
);
