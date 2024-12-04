import { BigUnit } from "../src/bigunit";
import { DivisionByZeroError } from "../src/errors";
describe("BigUnit Class fraction handling methods", () => {
  const precision = 2;
  const value = 10000n; // Represents 100.00 when precision is 2
  const bigUnit = new BigUnit(value, precision);
  const negativeBigUnit = new BigUnit(-value, precision);

  describe("percent method", () => {
    test("should calculate the correct percent with a valid number percentage", () => {
      const percentage = 10; // 10%
      const result = bigUnit.percent(percentage);
      const expectedValue = 1000n; // 10% of 10000n is 1000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should calculate the correct percent with a valid string percentage", () => {
      const percentage = "10"; // 10%
      const result = bigUnit.percent(percentage);
      const expectedValue = 1000n; // 10% of 10000n is 1000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should calculate the correct percent with a valid BigInt percentage", () => {
      const percentage = 10n; // 10%
      const result = bigUnit.percent(percentage);
      const expectedValue = 1000n; // 10% of 10000n is 1000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should calculate the correct percent with a valid Bigunit percentage", () => {
      const percentage = new BigUnit(10n, 0); // 10%
      const result = bigUnit.percent(percentage);
      const expectedValue = 1000n; // 10% of 10000n is 1000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should handle zero percent correctly", () => {
      const percentage = 0; // 0%
      const result = bigUnit.percent(percentage);
      const expectedValue = 0n; // 0% of anything is 0n

      expect(result.value).toBe(expectedValue);
    });

    test("should handle negative percent correctly", () => {
      const percentage1 = -10; // -10%
      const result1 = bigUnit.percent(percentage1);
      const expectedValue1 = -1000n; // -10% of 10000n is -1000n

      expect(result1.value).toBe(expectedValue1);
    });

    test("should handle negative bigunits with percent correctly", () => {
      const percentage1 = 10; // 10%
      const result1 = negativeBigUnit.percent(percentage1);
      const expectedValue1 = -1000n; // 10% of -10000n is 11000n

      expect(result1.value).toBe(expectedValue1);

      const percentage2 = -10; // -10%
      const result2 = negativeBigUnit.percent(percentage2);
      const expectedValue2 = 1000n; // -10% of -10000n is 1000n

      expect(result2.value).toBe(expectedValue2);

      const percentage3 = 0; // 0%
      const result3 = negativeBigUnit.percent(percentage3);
      const expectedValue3 = 0n; // 0% of anything is 0n

      expect(result3.value).toBe(expectedValue3);
    });
  });

  describe("fraction method", () => {
    test("should calculate the correct fraction with valid number type numerator and denominator", () => {
      const numerator = 1;
      const denominator = 2; // 1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 5000n; // 1/2 of 10000n is 5000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should calculate the correct fraction with valid string type numerator and denominator", () => {
      const numerator = "1";
      const denominator = "2"; // 1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 5000n; // 1/2 of 10000n is 5000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should calculate the correct fraction with valid BigInt type numerator and denominator", () => {
      const numerator = 1n;
      const denominator = 2n; // 1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 5000n; // 1/2 of 10000n is 5000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should calculate the correct fraction with valid Bigunit type numerator and denominator", () => {
      const numerator = new BigUnit(1n, 0);
      const denominator = new BigUnit(2n, 0); // 1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 5000n; // 1/2 of 10000n is 5000n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should handle zero numerator correctly", () => {
      const numerator = 0;
      const denominator = 2; // 0/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 0n; // 0/2 of anything is 0n

      expect(result.value).toBe(expectedValue);
    });

    test("should throw an error for zero denominator", () => {
      const numerator = 1;
      const denominator = 0; // 1/0 is not allowed

      expect(() => {
        bigUnit.fraction(numerator, denominator);
      }).toThrow(DivisionByZeroError);
    });

    test("should handle negative numerator correctly", () => {
      const numerator = -1;
      const denominator = 2; // -1/2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -5000n; // -1/2 of 10000n is -5000n

      expect(result.value).toBe(expectedValue);
    });

    test("should handle negative denominator correctly", () => {
      const numerator = 1;
      const denominator = -2; // 1/-2
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -5000n; // 1/-2 of 10000n is -5000n

      expect(result.value).toBe(expectedValue);
    });
  });
});
