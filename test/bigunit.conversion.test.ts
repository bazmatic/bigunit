import { BigUnit } from "../src/bigunit";

describe('BigUnit Class Conversion and Formatting Methods', () => {
  
    describe('toNumber method', () => {
      test('should correctly convert BigUnit instances to numbers for various precisions', () => {
        const unit1 = new BigUnit(12345n, 2); // 123.45
        const unit2 = new BigUnit(12345n, 3); // 12.345
        const unit3 = new BigUnit(12345n, 0); // 12345 (zero precision)
  
        expect(unit1.toNumber()).toBe(123.45);
        expect(unit2.toNumber()).toBe(12.345);
        expect(unit3.toNumber()).toBe(12345);
      });
    });
  
    describe('toString method', () => {
      test('should correctly represent BigUnit as a string for various precisions', () => {
        const unit1 = new BigUnit(12345n, 2); // "123.45"
        const unit2 = new BigUnit(12345n, 3); // "12.345"
        const unit3 = new BigUnit(12345n, 0); // "12345" (zero precision)
  
        expect(unit1.toString()).toBe("123.45");
        expect(unit2.toString()).toBe("12.345");
        expect(unit3.toString()).toBe("12345");
      });
    });
  
    describe('toBigInt method', () => {
      test('should correctly convert BigUnit to BigInt', () => {
        const value = 12345n;
        const unit = new BigUnit(value, 2);
  
        expect(unit.toBigInt()).toBe(value);
      });
    });
  
    describe('format method', () => {
      test('should format BigUnit to a string with given precision', () => {
        const unit = new BigUnit(12345n, 2); // 123.45
  
        expect(unit.format(1)).toBe("123.5");
        expect(unit.format(3)).toBe("123.450");
      });
  
      test('should handle zero precision in format method', () => {
        const unit = new BigUnit(12345n, 2); // 123.45
  
        expect(unit.format(0)).toBe("123");
      });
    });
  
  });
  