import { describe, it, expect } from 'vitest';
import {
  colIndexToLetter,
  DEFAULT_COLS,
  DEFAULT_ROWS,
  dataToGridValue,
  gridValueToData,
  getColumnCount,
  type CellValue,
} from './gridData';

describe('colIndexToLetter', () => {
  const cases: [number, string][] = [
    [0, 'A'],
    [1, 'B'],
    [25, 'Z'],
    [26, 'AA'],
    [27, 'AB'],
    [51, 'AZ'],
    [52, 'BA'],
    [99, 'CV'],
    [700, 'ZY'],
  ];
  cases.forEach(([index, expected]) => {
    it(`index ${index} -> "${expected}"`, () => {
      expect(colIndexToLetter(index)).toBe(expected);
    });
  });
});

describe('constants', () => {
  it('DEFAULT_COLS is 26', () => expect(DEFAULT_COLS).toBe(26));
  it('DEFAULT_ROWS is 100', () => expect(DEFAULT_ROWS).toBe(100));
});

describe('dataToGridValue', () => {
  it('empty data returns DEFAULT_ROWS rows with columnCount columns', () => {
    const out = dataToGridValue([], 5);
    expect(out.length).toBe(DEFAULT_ROWS);
    expect(Object.keys(out[0]!)).toEqual(['0', '1', '2', '3', '4']);
    expect(out[0]!['0']).toBeNull();
  });
  it('maps 2D array to row objects', () => {
    const data: CellValue[][] = [
      [1, 'x', null],
      [2, 'y', 3],
    ];
    const out = dataToGridValue(data, 3);
    expect(out.length).toBe(2);
    expect(out[0]).toEqual({ '0': 1, '1': 'x', '2': null });
    expect(out[1]).toEqual({ '0': 2, '1': 'y', '2': 3 });
  });
  it('pads short rows with null for columnCount', () => {
    const out = dataToGridValue([[1]], 3);
    expect(out[0]).toEqual({ '0': 1, '1': null, '2': null });
  });
});

describe('gridValueToData', () => {
  it('converts row objects back to 2D array', () => {
    const value = [
      { '0': 1, '1': 'a', '2': null },
      { '0': 2, '1': 'b', '2': 3 },
    ];
    expect(gridValueToData(value, 3)).toEqual([
      [1, 'a', null],
      [2, 'b', 3],
    ]);
  });
  it('round-trips with dataToGridValue', () => {
    const data: CellValue[][] = [[1, 2], [3], [null, 'x', 0]];
    const grid = dataToGridValue(data, 3);
    const back = gridValueToData(grid, 3);
    expect(back.length).toBe(3);
    expect(back[0]).toEqual([1, 2, null]);
    expect(back[1]).toEqual([3, null, null]);
    expect(back[2]).toEqual([null, 'x', 0]);
  });
});

describe('getColumnCount', () => {
  it('empty data returns DEFAULT_COLS', () => {
    expect(getColumnCount([])).toBe(DEFAULT_COLS);
  });
  it('returns max of DEFAULT_COLS and max row length', () => {
    expect(getColumnCount([[1, 2, 3]])).toBe(DEFAULT_COLS);
    expect(getColumnCount([Array(30).fill(1)])).toBe(30);
  });
});

describe('colIndexToLetter edge cases', () => {
  it('index 26 -> AA', () => expect(colIndexToLetter(26)).toBe('AA'));
  it('index 701 -> ZZ', () => expect(colIndexToLetter(701)).toBe('ZZ'));
  it('index 702 -> AAA', () => expect(colIndexToLetter(702)).toBe('AAA'));
});

describe('dataToGridValue edge cases', () => {
  it('single cell', () => {
    const out = dataToGridValue([[42]], 1);
    expect(out.length).toBe(1);
    expect(out[0]).toEqual({ '0': 42 });
  });
  it('empty row with columnCount', () => {
    const out = dataToGridValue([[]], 2);
    expect(out.length).toBe(1);
    expect(out[0]).toEqual({ '0': null, '1': null });
  });
});

describe('gridValueToData edge cases', () => {
  it('single column', () => {
    expect(gridValueToData([{ '0': 1 }], 1)).toEqual([[1]]);
  });
  it('missing keys become null', () => {
    expect(gridValueToData([{}], 2)).toEqual([[null, null]]);
  });
});
