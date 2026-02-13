import { describe, it, expect } from 'vitest';
import { formulaFunctions, type EvalContext } from './formulaFunctions';

const ctx: EvalContext = {
  getCell: (r, c) => (r === 0 && c === 0 ? 10 : r === 0 && c === 1 ? 20 : r === 1 && c === 0 ? 5 : null),
  currentRow: 0,
  currentCol: 0,
};

describe('formulaFunctions - SUM', () => {
  it('SUM(1,2,3)', () => expect(formulaFunctions.SUM!([1, 2, 3], ctx)).toBe(6));
  it('SUM(1)', () => expect(formulaFunctions.SUM!([1], ctx)).toBe(1));
  it('SUM()', () => expect(formulaFunctions.SUM!([], ctx)).toBe(0));
  it('SUM(A1,B1) via ctx', () => expect(formulaFunctions.SUM!(['A1', 'B1'], ctx)).toBe(30));
  it('SUM with range A1:B1', () => expect(formulaFunctions.SUM!(['A1:B1'], ctx)).toBe(30));
});

describe('formulaFunctions - AVERAGE', () => {
  it('AVERAGE(2,4,6)', () => expect(formulaFunctions.AVERAGE!([2, 4, 6], ctx)).toBe(4));
  it('AVERAGE(10)', () => expect(formulaFunctions.AVERAGE!([10], ctx)).toBe(10));
  it('AVERAGE()', () => expect(formulaFunctions.AVERAGE!([], ctx)).toBe(0));
});

describe('formulaFunctions - MIN/MAX', () => {
  it('MIN(5,2,8)', () => expect(formulaFunctions.MIN!([5, 2, 8], ctx)).toBe(2));
  it('MAX(5,2,8)', () => expect(formulaFunctions.MAX!([5, 2, 8], ctx)).toBe(8));
  it('MIN()', () => expect(formulaFunctions.MIN!([], ctx)).toBe(0));
});

describe('formulaFunctions - IF', () => {
  it('IF(1,a,b)', () => expect(formulaFunctions.IF!([1, 'a', 'b'], ctx)).toBe('a'));
  it('IF(0,a,b)', () => expect(formulaFunctions.IF!([0, 'a', 'b'], ctx)).toBe('b'));
  it('IF("TRUE",1,0)', () => expect(formulaFunctions.IF!(['TRUE', 1, 0], ctx)).toBe(1));
});

describe('formulaFunctions - AND/OR/NOT', () => {
  it('AND(1,1)', () => expect(formulaFunctions.AND!([1, 1], ctx)).toBe(1));
  it('AND(1,0)', () => expect(formulaFunctions.AND!([1, 0], ctx)).toBe(0));
  it('OR(0,1)', () => expect(formulaFunctions.OR!([0, 1], ctx)).toBe(1));
  it('OR(0,0)', () => expect(formulaFunctions.OR!([0, 0], ctx)).toBe(0));
  it('NOT(1)', () => expect(formulaFunctions.NOT!([1], ctx)).toBe(0));
  it('NOT(0)', () => expect(formulaFunctions.NOT!([0], ctx)).toBe(1));
});

describe('formulaFunctions - text', () => {
  it('LEFT("Hello",2)', () => expect(formulaFunctions.LEFT!(['Hello', 2], ctx)).toBe('He'));
  it('LEFT("Hi",0)', () => expect(formulaFunctions.LEFT!(['Hi', 0], ctx)).toBe(''));
  it('RIGHT("Hello",2)', () => expect(formulaFunctions.RIGHT!(['Hello', 2], ctx)).toBe('lo'));
  it('MID("Hello",2,2)', () => expect(formulaFunctions.MID!(['Hello', 2, 2], ctx)).toBe('el'));
  it('LEN("abc")', () => expect(formulaFunctions.LEN!(['abc'], ctx)).toBe(3));
  it('CONCATENATE("a","b")', () => expect(formulaFunctions.CONCATENATE!(['a', 'b'], ctx)).toBe('ab'));
  it('TRIM("  x  ")', () => expect(formulaFunctions.TRIM!(['  x  '], ctx)).toBe('x'));
  it('UPPER("hi")', () => expect(formulaFunctions.UPPER!(['hi'], ctx)).toBe('HI'));
  it('LOWER("HI")', () => expect(formulaFunctions.LOWER!(['HI'], ctx)).toBe('hi'));
  it('PROPER("hello world")', () => expect(formulaFunctions.PROPER!(['hello world'], ctx)).toBe('Hello World'));
});

describe('formulaFunctions - math', () => {
  it('ROUND(2.5)', () => expect(formulaFunctions.ROUND!([2.5], ctx)).toBe(3));
  it('ROUND(2.5,1)', () => expect(formulaFunctions.ROUND!([2.55, 1], ctx)).toBe(2.6));
  it('ABS(-5)', () => expect(formulaFunctions.ABS!([-5], ctx)).toBe(5));
  it('SQRT(4)', () => expect(formulaFunctions.SQRT!([4], ctx)).toBe(2));
  it('MOD(10,3)', () => expect(formulaFunctions.MOD!([10, 3], ctx)).toBe(1));
  it('POWER(2,3)', () => expect(formulaFunctions.POWER!([2, 3], ctx)).toBe(8));
  it('INT(3.9)', () => expect(formulaFunctions.INT!([3.9], ctx)).toBe(3));
  it('FLOOR(2.7)', () => expect(formulaFunctions.FLOOR!([2.7], ctx)).toBe(2));
  it('CEILING(2.1)', () => expect(formulaFunctions.CEILING!([2.1], ctx)).toBe(3));
});

describe('formulaFunctions - ROWS/COLUMNS', () => {
  it('ROWS(A1:B10)', () => expect(formulaFunctions.ROWS!(['A1:B10'], ctx)).toBe(10));
  it('COLUMNS(A1:Z1)', () => expect(formulaFunctions.COLUMNS!(['A1:Z1'], ctx)).toBe(26));
  it('ROWS(A1:A1)', () => expect(formulaFunctions.ROWS!(['A1:A1'], ctx)).toBe(1));
});

describe('formulaFunctions - FIND/SEARCH', () => {
  it('FIND("o","Hello")', () => expect(formulaFunctions.FIND!(['o', 'Hello'], ctx)).toBe(5));
  it('FIND("b","abc")', () => expect(formulaFunctions.FIND!(['b', 'abc'], ctx)).toBe(2));
  it('SEARCH("b","abc")', () => expect(formulaFunctions.SEARCH!(['b', 'abc'], ctx)).toBe(2));
});

describe('formulaFunctions - IFERROR', () => {
  it('IFERROR(5,"err")', () => expect(formulaFunctions.IFERROR!([5, 'err'], ctx)).toBe(5));
  it('IFERROR(#ERROR!,"err")', () => expect(formulaFunctions.IFERROR!(['#ERROR!', 'err'], ctx)).toBe('err'));
  it('IFERROR(NaN,"err")', () => expect(formulaFunctions.IFERROR!([NaN, 'err'], ctx)).toBe('err'));
});

describe('formulaFunctions - COUNT/COUNTA', () => {
  it('COUNT(1,2,3)', () => expect(formulaFunctions.COUNT!([1, 2, 3], ctx)).toBe(3));
  it('COUNTA(1,"x")', () => expect(formulaFunctions.COUNTA!([1, 'x'], ctx)).toBe(2));
});

describe('formulaFunctions - CHOOSE', () => {
  it('CHOOSE(2,"A","B","C")', () => expect(formulaFunctions.CHOOSE!([2, 'A', 'B', 'C'], ctx)).toBe('B'));
  it('CHOOSE(1,"X")', () => expect(formulaFunctions.CHOOSE!([1, 'X'], ctx)).toBe('X'));
});

describe('formulaFunctions - DATE/DAY/MONTH/YEAR', () => {
  it('DATE(2025,1,15)', () => expect(formulaFunctions.DATE!([2025, 1, 15], ctx)).toBe('2025-01-15'));
  it('DAY returns day of month for date string', () => {
    const d = formulaFunctions.DAY!(['2025-01-15'], ctx);
    expect(d).toBeGreaterThanOrEqual(14);
    expect(d).toBeLessThanOrEqual(15);
  });
});

describe('formulaFunctions - IS*', () => {
  it('ISNUMBER(42)', () => expect(formulaFunctions.ISNUMBER!([42], ctx)).toBe(1));
  it('ISNUMBER("x")', () => expect(formulaFunctions.ISNUMBER!(['x'], ctx)).toBe(0));
  it('ISTEXT("x")', () => expect(formulaFunctions.ISTEXT!(['x'], ctx)).toBe(1));
  it('ISERROR(#ERROR!)', () => expect(formulaFunctions.ISERROR!(['#ERROR!'], ctx)).toBe(1));
  it('ISERROR(5)', () => expect(formulaFunctions.ISERROR!([5], ctx)).toBe(0));
});

describe('formulaFunctions - CHAR/CODE', () => {
  it('CHAR(65)', () => expect(formulaFunctions['CHAR']!([65], ctx)).toBe('A'));
  it('CODE("A")', () => expect(formulaFunctions.CODE!(['A'], ctx)).toBe(65));
});

describe('formulaFunctions - REPT/REPLACE/SUBSTITUTE', () => {
  it('REPT("x",3)', () => expect(formulaFunctions.REPT!(['x', 3], ctx)).toBe('xxx'));
  it('REPLACE("abc",2,1,"X")', () => expect(formulaFunctions.REPLACE!(['abc', 2, 1, 'X'], ctx)).toBe('aXc'));
  it('SUBSTITUTE("a-b","-",",")', () => expect(formulaFunctions.SUBSTITUTE!(['a-b', '-', ','], ctx)).toBe('a,b'));
});

describe('formulaFunctions - TRUE/FALSE', () => {
  it('TRUE()', () => expect(formulaFunctions.TRUE!([], ctx)).toBe(1));
  it('FALSE()', () => expect(formulaFunctions.FALSE!([], ctx)).toBe(0));
});

describe('formulaFunctions - ROW/COLUMN', () => {
  it('ROW() uses currentRow', () => expect(formulaFunctions.ROW!([], ctx)).toBe(1));
  it('COLUMN() uses currentCol', () => expect(formulaFunctions.COLUMN!([], ctx)).toBe(1));
  it('ROW(A5)', () => expect(formulaFunctions.ROW!(['A5'], ctx)).toBe(5));
  it('COLUMN(C1)', () => expect(formulaFunctions.COLUMN!(['C1'], ctx)).toBe(3));
});

describe('formulaFunctions - MEDIAN', () => {
  it('MEDIAN(1,2,3)', () => expect(formulaFunctions.MEDIAN!([1, 2, 3], ctx)).toBe(2));
  it('MEDIAN(1,2,3,4)', () => expect(formulaFunctions.MEDIAN!([1, 2, 3, 4], ctx)).toBe(2.5));
});

describe('formulaFunctions - PRODUCT', () => {
  it('PRODUCT(2,3,4)', () => expect(formulaFunctions.PRODUCT!([2, 3, 4], ctx)).toBe(24));
});

describe('formulaFunctions - VALUE/N', () => {
  it('VALUE("99")', () => expect(formulaFunctions.VALUE!(['99'], ctx)).toBe(99));
  it('N(42)', () => expect(formulaFunctions.N!([42], ctx)).toBe(42));
});

describe('formulaFunctions - SIGN/FACT', () => {
  it('SIGN(10)', () => expect(formulaFunctions.SIGN!([10], ctx)).toBe(1));
  it('SIGN(-10)', () => expect(formulaFunctions.SIGN!([-10], ctx)).toBe(-1));
  it('FACT(5)', () => expect(formulaFunctions.FACT!([5], ctx)).toBe(120));
});

describe('formulaFunctions - EXACT', () => {
  it('EXACT("a","a")', () => expect(formulaFunctions.EXACT!(['a', 'a'], ctx)).toBe(1));
  it('EXACT("a","A")', () => expect(formulaFunctions.EXACT!(['a', 'A'], ctx)).toBe(0));
});

describe('formulaFunctions - PI/SIN/COS/TAN', () => {
  it('PI()', () => expect(formulaFunctions.PI!([], ctx)).toBe(Math.PI));
  it('SIN(0)', () => expect(formulaFunctions.SIN!([0], ctx)).toBe(0));
  it('COS(0)', () => expect(formulaFunctions.COS!([0], ctx)).toBe(1));
});

describe('formulaFunctions - TEXTJOIN/CONCAT/CLEAN', () => {
  it('TEXTJOIN(",",0,"a","b")', () => expect(formulaFunctions.TEXTJOIN!([',', 0, 'a', 'b'], ctx)).toBe('a,b'));
  it('CONCAT("1","2")', () => expect(formulaFunctions.CONCAT!(['1', '2'], ctx)).toBe('12'));
  it('CLEAN("test")', () => expect(formulaFunctions.CLEAN!(['test'], ctx)).toBe('test'));
});

describe('formulaFunctions - MROUND/FLOOR.MATH/CEILING.MATH', () => {
  it('MROUND(5,2)', () => expect(formulaFunctions['MROUND']!([5, 2], ctx)).toBe(6));
  it('FLOOR.MATH(3.7)', () => expect(formulaFunctions['FLOOR.MATH']!([3.7], ctx)).toBe(3));
  it('CEILING.MATH(2.2)', () => expect(formulaFunctions['CEILING.MATH']!([2.2], ctx)).toBe(3));
});

describe('formulaFunctions - XOR/IFS', () => {
  it('XOR(1,0)', () => expect(formulaFunctions.XOR!([1, 0], ctx)).toBe(1));
  it('XOR(1,1)', () => expect(formulaFunctions.XOR!([1, 1], ctx)).toBe(0));
  it('IFS(0,"a",1,"b")', () => expect(formulaFunctions.IFS!([0, 'a', 1, 'b'], ctx)).toBe('b'));
});
