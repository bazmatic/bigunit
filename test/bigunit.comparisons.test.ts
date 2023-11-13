import { BigUnit } from "../src/bigunit";

describe('BigUnit Class Comparison Methods', () => {
    const precision = 2;
    const value = 1000n;
    const bigUnit = new BigUnit(value, precision);
  
    const sameValueUnit = new BigUnit(value, precision);
    const higherValueUnit = new BigUnit(value + 100n, precision);
    const lowerValueUnit = new BigUnit(value - 100n, precision);
  
    describe('eq (equal) method', () => {
      test.only('should return true for same value and precision', () => {
        expect(bigUnit.eq(sameValueUnit)).toBe(true);
      });
  
      test('should return false for different values', () => {
        expect(bigUnit.eq(higherValueUnit)).toBe(false);
        expect(bigUnit.eq(lowerValueUnit)).toBe(false);
      });
  
      test('should handle BigUnitish inputs correctly', () => {
        expect(bigUnit.eq(value.toString())).toBe(true);
        expect(bigUnit.eq(Number(value) / 100)).toBe(true);
      });
    });
  
    describe('gt (greater than) method', () => {
      test('should return false for same value and precision', () => {
        expect(bigUnit.gt(sameValueUnit)).toBe(false);
      });
  
      test('should return true for lesser value', () => {
        expect(bigUnit.gt(lowerValueUnit)).toBe(true);
      });
  
      test('should return false for greater value', () => {
        expect(bigUnit.gt(higherValueUnit)).toBe(false);
      });
  
      test('should handle BigUnitish inputs correctly', () => {
        expect(bigUnit.gt((Number(value) - 100) / 100)).toBe(true);
      });
    });
  
    describe('lt (less than) method', () => {
      test('should return false for same value and precision', () => {
        expect(bigUnit.lt(sameValueUnit)).toBe(false);
      });
  
      test('should return false for lesser value', () => {
        expect(bigUnit.lt(lowerValueUnit)).toBe(false);
      });
  
      test('should return true for greater value', () => {
        expect(bigUnit.lt(higherValueUnit)).toBe(true);
      });
  
      test('should handle BigUnitish inputs correctly', () => {
        expect(bigUnit.lt((Number(value) + 100) / 100)).toBe(true);
      });
    });
  
    describe('gte (greater than or equal to) method', () => {
      test('should return true for same value and precision', () => {
        expect(bigUnit.gte(sameValueUnit)).toBe(true);
      });
  
      test('should return true for lesser value', () => {
        expect(bigUnit.gte(lowerValueUnit)).toBe(true);
      });
  
      test('should return false for greater value', () => {
        expect(bigUnit.gte(higherValueUnit)).toBe(false);
      });
  
      test('should handle BigUnitish inputs correctly', () => {
        expect(bigUnit.gte(value.toString())).toBe(true);
      });
    });
  
    describe('lte (less than or equal to) method', () => {
      test('should return true for same value and precision', () => {
        expect(bigUnit.lte(sameValueUnit)).toBe(true);
      });
  
      test('should return false for lesser value', () => {
        expect(bigUnit.lte(lowerValueUnit)).toBe(false);
      });
  
      test('should return true for greater value', () => {
        expect(bigUnit.lte(higherValueUnit)).toBe(true);
      });
  
      test('should handle BigUnitish inputs correctly', () => {
        expect(bigUnit.lte(Number(value) / 100)).toBe(true);
      });
    });
  });
  