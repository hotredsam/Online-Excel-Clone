import { describe, it, expect } from 'vitest';
import { parseCellRef, parseRange, colLetterToIndex } from './cellRef';

describe('parseCellRef', () => {
  const valid: [string, number, number][] = [
    ['A1', 0, 0],
    ['a1', 0, 0],
    ['B1', 1, 0],
    ['Z1', 25, 0],
    ['AA1', 26, 0],
    ['AB1', 27, 0],
    ['AZ1', 51, 0],
    ['BA1', 52, 0],
    ['B2', 1, 1],
    ['A10', 0, 9],
    ['Z10', 25, 9],
    ['A100', 0, 99],
    ['CV5', 99, 4],
    ['  B3  ', 1, 2],
  ];
  valid.forEach(([ref, col, row]) => {
    it(`parses "${ref}" to col=${col} row=${row}`, () => {
      const r = parseCellRef(ref);
      expect(r).toEqual({ col, row });
    });
  });

  const invalid = ['', '1', '1A', 'A', 'A0', 'A-1', 'B2:Z10', '=A1', '#REF!', 'AA', '1A1'];
  invalid.forEach((ref) => {
    it(`returns null for invalid "${ref}"`, () => {
      expect(parseCellRef(ref)).toBeNull();
    });
  });
});

describe('parseRange', () => {
  it('parses A1:B2', () => {
    expect(parseRange('A1:B2')).toEqual({
      start: { col: 0, row: 0 },
      end: { col: 1, row: 1 },
    });
  });
  it('parses B10:A1 and normalizes to A1:B10', () => {
    expect(parseRange('B10:A1')).toEqual({
      start: { col: 0, row: 0 },
      end: { col: 1, row: 9 },
    });
  });
  it('parses A1:Z100', () => {
    expect(parseRange('A1:Z100')).toEqual({
      start: { col: 0, row: 0 },
      end: { col: 25, row: 99 },
    });
  });
  const invalidRanges = ['A1', 'A1:B2:C3', '', 'A:B', '1:2'];
  invalidRanges.forEach((ref) => {
    it(`returns null for invalid range "${ref}"`, () => {
      expect(parseRange(ref)).toBeNull();
    });
  });
});

describe('colLetterToIndex', () => {
  const cases: [string, number][] = [
    ['A', 0],
    ['a', 0],
    ['Z', 25],
    ['AA', 26],
    ['AB', 27],
    ['AZ', 51],
    ['BA', 52],
    ['BZ', 77],
    ['CA', 78],
    ['ZZ', 701],
  ];
  cases.forEach(([letters, expected]) => {
    it(`${letters} -> ${expected}`, () => {
      expect(colLetterToIndex(letters)).toBe(expected);
    });
  });
});

describe('parseRange edge cases', () => {
  it('parses A1:A1 as single cell range', () => {
    expect(parseRange('A1:A1')).toEqual({ start: { col: 0, row: 0 }, end: { col: 0, row: 0 } });
  });
  it('parses Z100:A1 and normalizes', () => {
    expect(parseRange('Z100:A1')).toEqual({ start: { col: 0, row: 0 }, end: { col: 25, row: 99 } });
  });
  it('returns null for single cell', () => {
    expect(parseRange('A1')).toBeNull();
  });
});

describe('parseCellRef edge cases', () => {
  it('parses ZZ1', () => {
    const r = parseCellRef('ZZ1');
    expect(r).toEqual({ col: 701, row: 0 });
  });
  it('parses A16384', () => {
    const r = parseCellRef('A16384');
    expect(r).toEqual({ col: 0, row: 16383 });
  });
});
