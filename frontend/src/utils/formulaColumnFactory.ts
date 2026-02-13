import { createTextColumn } from 'react-datasheet-grid';
import { FormulaCellComponent } from '../components/formulaColumn';

export type FormulaColumnData = {
  getRaw: (row: number, col: number) => string | number | null;
  setUncommitted?: (row: number, col: number, value: string) => void;
};

/** Create a column that shows raw (formula) when focused and display (result) when not */
export function createFormulaColumn(columnData: FormulaColumnData) {
  const base = createTextColumn({
    parseUserInput: (v) => (v.trim() || null),
    formatBlurredInput: (v) => String(v ?? ''),
    formatInputOnFocus: (v) => String(v ?? ''),
  });
  return {
    ...base,
    component: FormulaCellComponent as unknown as typeof base.component,
    columnData: {
      ...(base.columnData || {}),
      ...columnData,
    },
  };
}
