import { memo, useLayoutEffect, useRef, useState } from 'react';
import type { CellProps } from 'react-datasheet-grid';

type FormulaColumnData = {
  getRaw?: (row: number, col: number) => string | number | null;
  setUncommitted?: (row: number, col: number, value: string) => void;
  placeholder?: string;
  alignRight?: boolean;
};

/** Cell component: when focused show raw (formula), when blurred show display (evaluated value) */
export const FormulaCellComponent = memo(function FormulaCellComponent(
  props: CellProps<string | number | null, FormulaColumnData>
) {
  const {
    rowData,
    rowIndex,
    columnIndex,
    focus,
    setRowData,
    columnData,
    active,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocusRef = useRef(false);
  const displayValue = rowData === null || rowData === undefined ? '' : String(rowData);
  const getRaw = columnData?.getRaw;
  const rawValue =
    getRaw != null
      ? (() => {
          const r = getRaw(rowIndex, columnIndex);
          return r === null || r === undefined ? '' : String(r);
        })()
      : displayValue;

  const [editingValue, setEditingValue] = useState('');
  const inputValue = focus ? editingValue : displayValue;

  useLayoutEffect(() => {
    if (!inputRef.current) return;
    const wasFocused = prevFocusRef.current;
    prevFocusRef.current = focus;
    if (focus) {
      if (!wasFocused) {
        const initial = getRaw ? rawValue : displayValue;
        setEditingValue(initial);
        columnData?.setUncommitted?.(rowIndex, columnIndex, initial);
        inputRef.current.focus();
        inputRef.current.select();
      }
    } else {
      setEditingValue(displayValue);
      inputRef.current.blur();
    }
  }, [focus, getRaw, rawValue, displayValue]);

  const parseInput = (value: string): string | number | null => {
    const t = value.trim();
    return t === '' ? null : t;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEditingValue(v);
    columnData?.setUncommitted?.(rowIndex, columnIndex, v);
    setRowData(parseInput(v));
  };

  // #region agent log
  if (rowIndex <= 1 && columnIndex <= 1) {
    fetch('http://127.0.0.1:7244/ingest/7c21604c-844c-488a-9658-bcef8075aaec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'formulaColumn.tsx:render',message:'cell render state',data:{rowIndex,columnIndex,focus,inputValue,displayValue,editingValue},timestamp:Date.now(),hypothesisId:'H1',runId:'post-fix'})}).catch(()=>{});
  }
  // #endregion

  return (
    <input
      ref={inputRef}
      className={'dsg-input' + (columnData?.alignRight ? ' dsg-input-align-right' : '')}
      placeholder={active ? columnData?.placeholder : undefined}
      tabIndex={-1}
      style={{ pointerEvents: focus ? 'auto' : 'none' }}
      value={inputValue}
      onChange={handleChange}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setEditingValue(displayValue);
        }
      }}
    />
  );
});
