import { describe, it, expect } from 'vitest';
import { evaluateFormula, evaluateSheet } from './formulaParser';
import type { EvalContext } from './formulaFunctions';
import type { CellValue } from './gridData';

const ctx: EvalContext = {
  getCell: (r, c) => (r === 0 && c === 0 ? 5 : r === 0 && c === 1 ? 10 : r === 1 && c === 0 ? 7 : null),
  currentRow: 0,
  currentCol: 0,
};

const formulaCases: [string, CellValue][] = [
  ['=1', 1],
  ['=0', 0],
  ['=2+3', 5],
  ['=2-3', -1],
  ['=6/2', 3],
  ['=2*3', 6],
  ['=2^10', 1024],
  ['=1=1', 1],
  ['=1=0', 0],
  ['=1>0', 1],
  ['=1<0', 0],
  ['=5>=5', 1],
  ['=3<=5', 1],
  ['=3<>5', 1],
  ['=COUNT(1,2,3)', 3],
  ['=COUNT()', 0],
  ['=SUM(1)', 1],
  ['=SUM(1,2)', 3],
  ['=SUM(1,2,3,4,5)', 15],
  ['=AVERAGE(2,4)', 3],
  ['=AVERAGE(10,20,30)', 20],
  ['=MIN(3,1,2)', 1],
  ['=MAX(3,1,2)', 3],
  ['=PRODUCT(2,3)', 6],
  ['=PRODUCT(2,3,4)', 24],
  ['=INT(3.9)', 3],
  ['=INT(-1.1)', -1],
  ['=FLOOR(2.7)', 2],
  ['=CEILING(2.1)', 3],
  ['=ROUND(2.5)', 3],
  ['=ROUND(2.4)', 2],
  ['=ROUNDDOWN(2.9)', 2],
  ['=ROUNDUP(2.1)', 3],
  ['=ABS(-10)', 10],
  ['=ABS(10)', 10],
  ['=SQRT(9)', 3],
  ['=SQRT(0)', 0],
  ['=MOD(7,2)', 1],
  ['=MOD(10,5)', 0],
  ['=POWER(2,4)', 16],
  ['=LEN("")', 0],
  ['=LEN("abc")', 3],
  ['=LEFT("Hello",1)', 'H'],
  ['=LEFT("Hello",0)', ''],
  ['=RIGHT("Hello",1)', 'o'],
  ['=MID("Hello",2,2)', 'el'],
  ['=AND(1,1)', 1],
  ['=AND(1,0)', 0],
  ['=OR(0,0)', 0],
  ['=OR(0,1)', 1],
  ['=NOT(1)', 0],
  ['=NOT(0)', 1],
  ['=CONCATENATE("")', ''],
  ['=CONCATENATE("a","b","c")', 'abc'],
  ['=TRIM("  x  ")', 'x'],
  ['=UPPER("Hi")', 'HI'],
  ['=LOWER("HI")', 'hi'],
  ['=ISNUMBER(0)', 1],
  ['=ISNUMBER("x")', 0],
  ['=ISTEXT("x")', 1],
  ['=ISTEXT(1)', 0],
  ['=ISBLANK(0)', 0],
  ['=MEDIAN(1,2,3)', 2],
  ['=MEDIAN(1,2,3,4)', 2.5],
  ['=EXP(0)', 1],
  ['=LN(1)', 0],
  ['=LOG(100)', 2],
  ['=LOG(8,2)', 3],
  ['=SIN(0)', 0],
  ['=COS(0)', 1],
  ['=TAN(0)', 0],
  ['=REPT("a",0)', ''],
  ['=REPT("ab",2)', 'abab'],
  ['=EXACT("a","a")', 1],
  ['=EXACT("a","A")', 0],
  ['=VALUE("99")', 99],
  ['=N(42)', 42],
  ['=SIGN(100)', 1],
  ['=SIGN(-100)', -1],
  ['=SIGN(0)', 0],
  ['=FACT(0)', 1],
  ['=FACT(1)', 1],
  ['=FACT(4)', 24],
  ['=COUNTA(1,"x")', 2],
  ['=IF(1,2,3)', 2],
  ['=IF(0,2,3)', 3],
  ['=ROWS(A1:A5)', 5],
  ['=COLUMNS(A1:E1)', 5],
  ['=FIND("b","abc")', 2],
  ['=SEARCH("b","abc")', 2],
  ['=SUBSTITUTE("x-x","-",",")', 'x,x'],
  ['=REPLACE("abc",2,1,"X")', 'aXc'],
  ['=CHAR(97)', 'a'],
  ['=CODE("a")', 97],
  ['=TEXTJOIN(",",0,"a","b")', 'a,b'],
  ['=CLEAN("test")', 'test'],
  ['=CONCAT("1","2")', '12'],
  ['=MROUND(5,2)', 6],
  ['=MROUND(4,2)', 4],
  ['=FLOOR.MATH(3.7)', 3],
  ['=CEILING.MATH(2.2)', 3],
  ['=ROUND(COS(0),4)', 1],
  ['=ROUND(COS(0),2)', 1],
  ['=2*3+4', 10],
  ['=2*(3+4)', 14],
  ['=10/2-1', 4],
  ['=-(-5)', 5],
  ['="a"&"b"&"c"', 'abc'],
  ['=A1', 5],
  ['=B1', 10],
  ['=A1+B1', 15],
  ['=A2', 7],
  ['=SUM(A1,B1)', 15],
  ['=AVERAGE(A1,B1)', 7.5],
  ['=MIN(A1,B1,A2)', 5],
  ['=MAX(A1,B1,A2)', 10],
];

const formulaCases2: [string, CellValue][] = [
  ['=1*1', 1],
  ['=0+0', 0],
  ['=10-1', 9],
  ['=3*4', 12],
  ['=100/10', 10],
  ['=2^3', 8],
  ['=5=5', 1],
  ['=5<>5', 0],
  ['=10>5', 1],
  ['=5<10', 1],
  ['=SUM(0,0)', 0],
  ['=AVERAGE(0)', 0],
  ['=MIN(5)', 5],
  ['=MAX(5)', 5],
  ['=PRODUCT(1,2)', 2],
  ['=INT(1.1)', 1],
  ['=FLOOR(1.9)', 1],
  ['=CEILING(1.1)', 2],
  ['=ROUND(1.5)', 2],
  ['=ABS(0)', 0],
  ['=SQRT(1)', 1],
  ['=MOD(5,5)', 0],
  ['=POWER(10,0)', 1],
  ['=LEN("")', 0],
  ['=LEFT("X",1)', 'X'],
  ['=RIGHT("X",1)', 'X'],
  ['=MID("ABC",1,1)', 'A'],
  ['=AND(1)', 1],
  ['=OR(0)', 0],
  ['=NOT(1)', 0],
  ['=CONCATENATE("x")', 'x'],
  ['=TRIM("x")', 'x'],
  ['=UPPER("a")', 'A'],
  ['=LOWER("A")', 'a'],
  ['=ISNUMBER(1)', 1],
  ['=ISTEXT(1)', 0],
  ['=MEDIAN(5)', 5],
  ['=EXP(1)', 2.718281828459045],
  ['=LN(2.718281828459045)', 1],
  ['=LOG(10)', 1],
  ['=SIN(0)', 0],
  ['=COS(0)', 1],
  ['=TAN(0)', 0],
  ['=REPT("x",1)', 'x'],
  ['=EXACT("","")', 1],
  ['=VALUE("0")', 0],
  ['=N(0)', 0],
  ['=SIGN(1)', 1],
  ['=FACT(0)', 1],
  ['=COUNTA(1)', 1],
  ['=IF(1,0,1)', 0],
  ['=ROWS(A1:A10)', 10],
  ['=COLUMNS(A1:C1)', 3],
  ['=FIND("a","abc")', 1],
  ['=SEARCH("a","abc")', 1],
  ['=SUBSTITUTE("a","a","b")', 'b'],
  ['=REPLACE("xy",1,1,"z")', 'zy'],
  ['=CHAR(66)', 'B'],
  ['=CODE("B")', 66],
  ['=TEXTJOIN("",0,"a")', 'a'],
  ['=CLEAN("")', ''],
  ['=CONCAT("a")', 'a'],
  ['=MROUND(4,2)', 4],
  ['=FLOOR.MATH(1)', 1],
  ['=CEILING.MATH(1)', 1],
  ['=1+1+1', 3],
  ['=2*2*2', 8],
  ['=(1+1)*2', 4],
  ['=10/(2+3)', 2],
  ['=-1', -1],
  ['="x"&"y"', 'xy'],
  ['=A1', 5],
  ['=B1*2', 20],
  ['=A1-A2', -2],
  ['=SUM(A1,A2)', 12],
  ['=AVERAGE(A1,A2,B1)', 7.333333333333333],
  ['=MIN(A1,B1)', 5],
  ['=MAX(A1,B1)', 10],
  ['=IF(A1>5,1,0)', 0],
  ['=IF(A2>10,1,0)', 0],
  ['=AND(A1,A2)', 1],
  ['=OR(0,A1)', 1],
  ['=LEN("hello")', 5],
  ['=ROUND(1.234,2)', 1.23],
  ['=ABS(-1)', 1],
  ['=SQRT(4)', 2],
  ['=MOD(8,3)', 2],
  ['=POWER(3,2)', 9],
  ['=INT(-0.5)', 0],
  ['=TRUE()', 1],
  ['=FALSE()', 0],
  ['=PI()', Math.PI],
  ['=CHOOSE(1,"a","b")', 'a'],
  ['=ISNUMBER("a")', 0],
  ['=ISTEXT("a")', 1],
  ['=IFERROR(1,"x")', 1],
  ['=REPT("ab",1)', 'ab'],
  ['=TEXTJOIN(",",0,"a","b","c")', 'a,b,c'],
  ['=VALUE("42")', 42],
  ['=XOR(0,0)', 0],
  ['=XOR(1,1)', 0],
  ['=IFS(1,"a",0,"b")', 'a'],
];

describe('evaluateFormula bulk', () => {
  formulaCases.forEach(([formula, expected], i) => {
    it(`case ${i + 1}: ${formula} => ${expected}`, () => {
      const result = evaluateFormula(formula, ctx);
      if (typeof expected === 'number' && typeof result === 'number') {
        if (Number.isFinite(expected) && Number.isFinite(result)) {
          expect(result).toBeCloseTo(expected as number, 10);
        } else {
          expect(result).toBe(expected);
        }
      } else {
        expect(result).toEqual(expected);
      }
    });
  });
});

describe('evaluateFormula bulk 2', () => {
  formulaCases2.forEach(([formula, expected], i) => {
    it(`case ${i + 1}: ${formula} => ${expected}`, () => {
      const result = evaluateFormula(formula, ctx);
      if (typeof expected === 'number' && typeof result === 'number') {
        if (Number.isFinite(expected) && Number.isFinite(result)) {
          expect(result).toBeCloseTo(expected as number, 10);
        } else {
          expect(result).toBe(expected);
        }
      } else {
        expect(result).toEqual(expected);
      }
    });
  });
});

describe('evaluateSheet bulk', () => {
  const sheetCases: { raw: CellValue[][]; row: number; col: number; expected: CellValue }[] = [
    { raw: [['=1+1']], row: 0, col: 0, expected: 2 },
    { raw: [['=2*3']], row: 0, col: 0, expected: 6 },
    { raw: [['=SUM(1,2,3)']], row: 0, col: 0, expected: 6 },
    { raw: [['=IF(1,10,20)']], row: 0, col: 0, expected: 10 },
    { raw: [['=IF(0,10,20)']], row: 0, col: 0, expected: 20 },
    { raw: [[1, 2, '=A1+B1']], row: 0, col: 2, expected: 3 },
    { raw: [['=LEN("hi")']], row: 0, col: 0, expected: 2 },
    { raw: [['=UPPER("hi")']], row: 0, col: 0, expected: 'HI' },
    { raw: [['=ROUND(3.14,1)']], row: 0, col: 0, expected: 3.1 },
    { raw: [['=ABS(-5)']], row: 0, col: 0, expected: 5 },
    { raw: [['=1+2', '=A1*2']], row: 0, col: 0, expected: 3 },
    { raw: [['=1+2', '=A1*2']], row: 0, col: 1, expected: 6 },
    { raw: [[1, 2, 3, '=SUM(A1:C1)']], row: 0, col: 3, expected: 6 },
    { raw: [['=IF(1,100,0)']], row: 0, col: 0, expected: 100 },
    { raw: [['=LEN("test")']], row: 0, col: 0, expected: 4 },
    { raw: [['=ROUND(2.25,1)']], row: 0, col: 0, expected: 2.3 },
    { raw: [['=MIN(1,2,3)']], row: 0, col: 0, expected: 1 },
    { raw: [['=MAX(1,2,3)']], row: 0, col: 0, expected: 3 },
    { raw: [['=PRODUCT(2,3)']], row: 0, col: 0, expected: 6 },
    { raw: [['=MOD(10,4)']], row: 0, col: 0, expected: 2 },
    { raw: [['=UPPER("a")']], row: 0, col: 0, expected: 'A' },
    { raw: [['=LOWER("A")']], row: 0, col: 0, expected: 'a' },
    { raw: [['=LEFT("Hi",1)']], row: 0, col: 0, expected: 'H' },
    { raw: [['=RIGHT("Hi",1)']], row: 0, col: 0, expected: 'i' },
    { raw: [['=AND(1,1)']], row: 0, col: 0, expected: 1 },
    { raw: [['=OR(0,1)']], row: 0, col: 0, expected: 1 },
    { raw: [['=NOT(0)']], row: 0, col: 0, expected: 1 },
    { raw: [['=TRUE()']], row: 0, col: 0, expected: 1 },
    { raw: [['=FALSE()']], row: 0, col: 0, expected: 0 },
  ];
  sheetCases.forEach(({ raw, row, col, expected }, i) => {
    it(`sheet case ${i + 1}: [${row}][${col}] => ${expected}`, () => {
      const out = evaluateSheet(raw);
      const result = out[row]?.[col];
      if (typeof expected === 'number' && typeof result === 'number') {
        expect(result).toBeCloseTo(expected as number, 10);
      } else {
        expect(result).toEqual(expected);
      }
    });
  });
});
