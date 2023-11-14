import { BigUnit } from "../src/bigunit";
describe("BigUnit Class fraction handling methods", () => {
  const precision = 2;
  const value = 10000n; // Represents 100.00 when precision is 2
  const bigUnit = new BigUnit(value, precision);

  describe("percent method", () => {
    test("should calculate the correct percent with a valid percentage", () => {
      const percentage = 10; // 10%
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
      const percentage = -10; // -10%
      const result = bigUnit.percent(percentage);
      const expectedValue = -1000n; // -10% of 10000n is -1000n

      expect(result.value).toBe(expectedValue);
    });
  });

  describe("fraction method", () => {
    test("should calculate the correct fraction with valid numerator and denominator", () => {
      const numerator = 1;
      const denominator = 2; // 1/2
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
      }).toThrow("Denominator cannot be zero");
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
