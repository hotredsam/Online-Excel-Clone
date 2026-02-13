import { describe, it, expect } from 'vitest';
import { evaluateFormula, evaluateSheet } from './formulaParser';
import type { EvalContext } from './formulaFunctions';
import type { CellValue } from './gridData';

const ctx: EvalContext = {
  getCell: (row, col) => (row === 0 && col === 0 ? 10 : row === 1 && col === 0 ? 20 : null),
  currentRow: 0,
  currentCol: 0,
};

describe('evaluateFormula - non-formula', () => {
  it('returns string as-is when not starting with =', () => {
    expect(evaluateFormula('hello', ctx)).toBe('hello');
    expect(evaluateFormula('123', ctx)).toBe('123');
    expect(evaluateFormula('', ctx)).toBe('');
  });
  it('empty formula returns empty string', () => {
    expect(evaluateFormula('=', ctx)).toBe('');
  });
});

describe('evaluateFormula - arithmetic', () => {
  const cases: [string, CellValue][] = [
    ['=1+2', 3],
    ['=10-3', 7],
    ['=2*5', 10],
    ['=20/4', 5],
    ['=2^3', 8],
    ['=1+2*3', 7],
    ['=(1+2)*3', 9],
    ['=-5', -5],
    ['=+5', 5],
    ['=1+2+3+4', 10],
    ['=10/3', 3.3333333333333335],
    ['=0*100', 0],
  ];
  cases.forEach(([formula, expected]) => {
    it(`${formula} => ${expected}`, () => {
      expect(evaluateFormula(formula, ctx)).toBe(expected);
    });
  });
});

describe('evaluateFormula - comparison', () => {
  const cases: [string, number][] = [
    ['=1>0', 1],
    ['=1<0', 0],
    ['=1=1', 1],
    ['=1>=1', 1],
    ['=1<=0', 0],
    ['=1<>0', 1],
  ];
  cases.forEach(([formula, expected]) => {
    it(`${formula} => ${expected}`, () => {
      expect(evaluateFormula(formula, ctx)).toBe(expected);
    });
  });
});

describe('evaluateFormula - cell refs', () => {
  it('=A1 returns value from getCell(0,0)', () => {
    expect(evaluateFormula('=A1', ctx)).toBe(10);
  });
  it('=A2 returns value from getCell(1,0)', () => {
    expect(evaluateFormula('=A2', ctx)).toBe(20);
  });
  it('=A1+A2 returns 30', () => {
    expect(evaluateFormula('=A1+A2', ctx)).toBe(30);
  });
});

describe('evaluateFormula - strings', () => {
  it('="hello" returns hello', () => {
    expect(evaluateFormula('="hello"', ctx)).toBe('hello');
  });
  it('="a"&"b" returns ab', () => {
    expect(evaluateFormula('="a"&"b"', ctx)).toBe('ab');
  });
});

describe('evaluateFormula - functions', () => {
  it('=SUM(1,2,3) => 6', () => {
    expect(evaluateFormula('=SUM(1,2,3)', ctx)).toBe(6);
  });
  it('=AVERAGE(10,20) => 15', () => {
    expect(evaluateFormula('=AVERAGE(10,20)', ctx)).toBe(15);
  });
  it('=IF(1,"yes","no") => yes', () => {
    expect(evaluateFormula('=IF(1,"yes","no")', ctx)).toBe('yes');
  });
  it('=IF(0,"yes","no") => no', () => {
    expect(evaluateFormula('=IF(0,"yes","no")', ctx)).toBe('no');
  });
  it('=AND(1,1) => 1', () => {
    expect(evaluateFormula('=AND(1,1)', ctx)).toBe(1);
  });
  it('=OR(0,1) => 1', () => {
    expect(evaluateFormula('=OR(0,1)', ctx)).toBe(1);
  });
  it('=NOT(0) => 1', () => {
    expect(evaluateFormula('=NOT(0)', ctx)).toBe(1);
  });
  it('=TRUE() => 1', () => {
    expect(evaluateFormula('=TRUE()', ctx)).toBe(1);
  });
  it('=FALSE() => 0', () => {
    expect(evaluateFormula('=FALSE()', ctx)).toBe(0);
  });
  it('=LEN("abc") => 3', () => {
    expect(evaluateFormula('=LEN("abc")', ctx)).toBe(3);
  });
  it('=ROUND(3.14159,2) => 3.14', () => {
    expect(evaluateFormula('=ROUND(3.14159,2)', ctx)).toBe(3.14);
  });
  it('=MIN(5,2,8) => 2', () => {
    expect(evaluateFormula('=MIN(5,2,8)', ctx)).toBe(2);
  });
  it('=MAX(5,2,8) => 8', () => {
    expect(evaluateFormula('=MAX(5,2,8)', ctx)).toBe(8);
  });
  it('=ABS(-7) => 7', () => {
    expect(evaluateFormula('=ABS(-7)', ctx)).toBe(7);
  });
  it('=SQRT(4) => 2', () => {
    expect(evaluateFormula('=SQRT(4)', ctx)).toBe(2);
  });
  it('=MOD(10,3) => 1', () => {
    expect(evaluateFormula('=MOD(10,3)', ctx)).toBe(1);
  });
  it('=POWER(2,3) => 8', () => {
    expect(evaluateFormula('=POWER(2,3)', ctx)).toBe(8);
  });
  it('=LEFT("Hello",2) => He', () => {
    expect(evaluateFormula('=LEFT("Hello",2)', ctx)).toBe('He');
  });
  it('=RIGHT("Hello",2) => lo', () => {
    expect(evaluateFormula('=RIGHT("Hello",2)', ctx)).toBe('lo');
  });
  it('=MID("Hello",2,2) => el', () => {
    expect(evaluateFormula('=MID("Hello",2,2)', ctx)).toBe('el');
  });
  it('=UPPER("hi") => HI', () => {
    expect(evaluateFormula('=UPPER("hi")', ctx)).toBe('HI');
  });
  it('=LOWER("HI") => hi', () => {
    expect(evaluateFormula('=LOWER("HI")', ctx)).toBe('hi');
  });
  it('=TRIM("  x  ") => x', () => {
    expect(evaluateFormula('=TRIM("  x  ")', ctx)).toBe('x');
  });
  it('=CONCATENATE("a","b") => ab', () => {
    expect(evaluateFormula('=CONCATENATE("a","b")', ctx)).toBe('ab');
  });
  it('=PROPER("hello world") => Hello World', () => {
    expect(evaluateFormula('=PROPER("hello world")', ctx)).toBe('Hello World');
  });
  it('=CHAR(65) => A', () => {
    expect(evaluateFormula('=CHAR(65)', ctx)).toBe('A');
  });
  it('=CODE("A") => 65', () => {
    expect(evaluateFormula('=CODE("A")', ctx)).toBe(65);
  });
  it('=FACT(5) => 120', () => {
    expect(evaluateFormula('=FACT(5)', ctx)).toBe(120);
  });
  it('=SIGN(5) => 1', () => {
    expect(evaluateFormula('=SIGN(5)', ctx)).toBe(1);
  });
  it('=SIGN(-3) => -1', () => {
    expect(evaluateFormula('=SIGN(-3)', ctx)).toBe(-1);
  });
  it('=PI() is a number', () => {
    expect(typeof evaluateFormula('=PI()', ctx)).toBe('number');
    expect((evaluateFormula('=PI()', ctx) as number) - 3.14).toBeLessThan(0.01);
  });
  it('=CHOOSE(2,"A","B","C") => B', () => {
    expect(evaluateFormula('=CHOOSE(2,"A","B","C")', ctx)).toBe('B');
  });
  it('=ROWS(A1:B10) => 10', () => {
    expect(evaluateFormula('=ROWS(A1:B10)', ctx)).toBe(10);
  });
  it('=COLUMNS(A1:Z1) => 26', () => {
    expect(evaluateFormula('=COLUMNS(A1:Z1)', ctx)).toBe(26);
  });
  it('=EXACT("a","a") => 1', () => {
    expect(evaluateFormula('=EXACT("a","a")', ctx)).toBe(1);
  });
  it('=EXACT("a","b") => 0', () => {
    expect(evaluateFormula('=EXACT("a","b")', ctx)).toBe(0);
  });
  it('=ISNUMBER(42) => 1', () => {
    expect(evaluateFormula('=ISNUMBER(42)', ctx)).toBe(1);
  });
  it('=ISTEXT("x") => 1', () => {
    expect(evaluateFormula('=ISTEXT("x")', ctx)).toBe(1);
  });
  it('=ISBLANK(A3) => 1 when cell empty', () => {
    expect(evaluateFormula('=ISBLANK(A3)', ctx)).toBe(1);
  });
  it('=N(100) => 100', () => {
    expect(evaluateFormula('=N(100)', ctx)).toBe(100);
  });
  it('=MROUND(10,3) => 9', () => {
    expect(evaluateFormula('=MROUND(10,3)', ctx)).toBe(9);
  });
  it('=IFERROR(1/0,"err") => err', () => {
    expect(evaluateFormula('=IFERROR(1/0,"err")', ctx)).toBe('err');
  });
  it('=IFERROR(5,"err") => 5', () => {
    expect(evaluateFormula('=IFERROR(5,"err")', ctx)).toBe(5);
  });
  it('=TEXTJOIN("-",1,"a","b") => a-b', () => {
    expect(evaluateFormula('=TEXTJOIN("-",1,"a","b")', ctx)).toBe('a-b');
  });
  it('=REPT("x",3) => xxx', () => {
    expect(evaluateFormula('=REPT("x",3)', ctx)).toBe('xxx');
  });
  it('=SUBSTITUTE("a-b","-",",") => a,b', () => {
    expect(evaluateFormula('=SUBSTITUTE("a-b","-",",")', ctx)).toBe('a,b');
  });
  it('=FIND("o","Hello") => 5', () => {
    expect(evaluateFormula('=FIND("o","Hello")', ctx)).toBe(5);
  });
  it('=VALUE("42") => 42', () => {
    expect(evaluateFormula('=VALUE("42")', ctx)).toBe(42);
  });
  it('=CLEAN("hi") => hi', () => {
    expect(evaluateFormula('=CLEAN("hi")', ctx)).toBe('hi');
  });
  it('=CONCAT("x","y") => xy', () => {
    expect(evaluateFormula('=CONCAT("x","y")', ctx)).toBe('xy');
  });
  it('=XOR(1,0) => 1', () => {
    expect(evaluateFormula('=XOR(1,0)', ctx)).toBe(1);
  });
  it('=XOR(1,1) => 0', () => {
    expect(evaluateFormula('=XOR(1,1)', ctx)).toBe(0);
  });
  it('=IFS(0,"a",1,"b") => b', () => {
    expect(evaluateFormula('=IFS(0,"a",1,"b")', ctx)).toBe('b');
  });
});

describe('evaluateFormula - errors', () => {
  it('unknown function returns #NAME?', () => {
    expect(evaluateFormula('=NOTAFUNC(1)', ctx)).toBe('#NAME?');
  });
});

describe('evaluateSheet', () => {
  it('evaluates formulas in grid', () => {
    const raw: CellValue[][] = [
      [1, 2, '=A1+B1'],
      [10, 20, '=A2*2'],
    ];
    const out = evaluateSheet(raw);
    expect(out[0]![2]).toBe(3);
    expect(out[1]![2]).toBe(20);
  });
  it('handles empty grid', () => {
    const out = evaluateSheet([]);
    expect(out).toEqual([]);
  });
  it('handles non-formula cells as-is', () => {
    const raw: CellValue[][] = [['hello', 42, null]];
    const out = evaluateSheet(raw);
    expect(out[0]).toEqual(['hello', 42, null]);
  });
  it('formula referencing another formula', () => {
    const raw: CellValue[][] = [
      ['=1+1', '=A1*2'],
    ];
    const out = evaluateSheet(raw);
    expect(out[0]![0]).toBe(2);
    expect(out[0]![1]).toBe(4);
  });
});
