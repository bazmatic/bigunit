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
  describe('BigUnit Class percent and fraction Methods', () => {
  const precision = 2;
  const value = 10000n; // Represents 100.00 when precision is 2
  const bigUnit = new BigUnit(value, precision);

  describe('percent method', () => {
    test('should calculate the correct percent with a valid percentage', () => {
      const percentage = 10; // 10%
      const result = bigUnit.percent(percentage);
      const expectedValue = 1000n; // 10% of 10000n is 1000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test('should handle zero percent correctly', () => {
      const percentage = 0; // 0%
      const result = bigUnit.percent(percentage);
      const expectedValue = 0n; // 0% of anything is 0n

      expect(result.value).toBe(expectedValue);
    });

    test('should handle negative percent correctly', () => {
      const percentage = -10; // -10%
      const result = bigUnit.percent(percentage);
      const expectedValue = -1000n; // -10% of 10000n is -1000n

      expect(result.value).toBe(expectedValue);
    });
  });

  describe('fraction method', () => {
    test('should calculate the correct fraction with valid numerator and denominator', () => {
      const numerator = 1;
      const denominator = 2; // 1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 5000n; // 1/2 of 10000n is 5000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test('should handle zero numerator correctly', () => {
      const numerator = 0;
      const denominator = 2; // 0/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 0n; // 0/2 of anything is 0n

      expect(result.value).toBe(expectedValue);
    });

    test('should throw an error for zero denominator', () => {
      const numerator = 1;
      const denominator = 0; // 1/0 is not allowed

      expect(() => {
        bigUnit.fraction(numerator, denominator);
      }).toThrow("Denominator cannot be zero");
    });

    test('should handle negative numerator correctly', () => {
      const numerator = -1;
      const denominator = 2; // -1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -5000n; // -1/2 of 10000n is -5000n

      expect(result.value).toBe(expectedValue);
    });

    test('should handle negative denominator correctly', () => {
      const numerator = 1;
      const denominator = -2; // 1/-2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -5000n; // 1/-2 of 10000n is -5000n

      expect(result.value).toBe(expectedValue);
    });
  });
});
