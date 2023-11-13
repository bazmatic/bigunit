import { BigUnit } from "../src/bigunit";

describe('BigUnit Class State Methods', () => {
    const precision = 2;
  
    describe('isZero method', () => {
      test('should return true for a zero value', () => {
        const zeroUnit = new BigUnit(0n, precision);
        expect(zeroUnit.isZero()).toBe(true);
      });
  
      test('should return false for a non-zero value', () => {
        const nonZeroUnit = new BigUnit(1000n, precision);
        expect(nonZeroUnit.isZero()).toBe(false);
      });
    });
  
    describe('isPositive method', () => {
      test('should return true for a positive value', () => {
        const positiveUnit = new BigUnit(1000n, precision);
        expect(positiveUnit.isPositive()).toBe(true);
      });
  
      test('should return false for zero value', () => {
        const zeroUnit = new BigUnit(0n, precision);
        expect(zeroUnit.isPositive()).toBe(false);
      });
  
      test('should return false for a negative value', () => {
        const negativeUnit = new BigUnit(-1000n, precision);
        expect(negativeUnit.isPositive()).toBe(false);
      });
    });
  
    describe('isNegative method', () => {
      test('should return true for a negative value', () => {
        const negativeUnit = new BigUnit(-1000n, precision);
        expect(negativeUnit.isNegative()).toBe(true);
      });
  
      test('should return false for zero value', () => {
        const zeroUnit = new BigUnit(0n, precision);
        expect(zeroUnit.isNegative()).toBe(false);
      });
  
      test('should return false for a positive value', () => {
        const positiveUnit = new BigUnit(1000n, precision);
        expect(positiveUnit.isNegative()).toBe(false);
      });
    });
  });
  