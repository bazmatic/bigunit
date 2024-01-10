import { BigUnit } from "../src/bigunit";
import { DivisionByZeroError } from "../src/errors";
import { bigintCloseTo } from "../src/utils";

describe("BigUnit Class Methods", () => {
  const precision = 2;
  const highPrecision = 10;
  const unitValue1 = 1000n;
  const unitValue2 = 500n;
  const unitValue3 = -500n;
  const unitValue4 = -1000n;
  const unit1 = new BigUnit(unitValue1, precision);
  const unit2 = new BigUnit(unitValue2, precision);
  const unit3 = new BigUnit(unitValue3, precision);
  const unit4 = new BigUnit(unitValue4, precision);

  const unit5 = new BigUnit(unitValue1, highPrecision);
  const unit6 = new BigUnit(unitValue2, highPrecision);

  describe("add method", () => {
    test("should add two BigUnit instances of the same precision", () => {
      const result1 = unit1.add(unit2);
      expect(result1.value).toBe(unitValue1 + unitValue2);
      expect(result1.precision).toBe(precision);
    });

    test("should add two BigUnit instances of differing precision", () => {
      const result1 = unit5.add(unit6);
      expect(result1.value).toBe(unitValue1 + unitValue2);
      expect(result1.precision).toBe(highPrecision);

      const result2 = unit6.add(unit5);
      expect(result2.value).toBe(unitValue2 + unitValue1);
      expect(result2.precision).toBe(highPrecision);
    });

    test("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult1 = unit1.add(unit3);
      const zeroResult = unit1.add(zeroUnit);

      expect(negativeResult1.value).toBe(unitValue1 + unitValue3);
      expect(zeroResult.value).toBe(unitValue1);

      const negativeResult2 = unit3.add(unit4)
      expect(negativeResult2.value).toBe(unitValue3 + unitValue4);

      const negativeResult3 = unit3.add(unit1)
      expect(negativeResult3.value).toBe(unitValue3 + unitValue1);
    });
  });

  describe("sub method", () => {
    // Repeat the structure of add method tests for sub method
    it("should subtract two BigUnit instances of the same precision", () => {
      const result = unit1.sub(unit2);
      expect(result.value).toBe(unitValue1 - unitValue2);
      expect(result.precision).toBe(precision);
    });

    it("should subtract two BigUnit instances of the differing precision", () => {
      const result1 = unit5.sub(unit6);
      expect(result1.value).toBe(unitValue1 - unitValue2);
      expect(result1.precision).toBe(highPrecision);

      const result2 = unit6.sub(unit5);
      expect(result2.value).toBe(unitValue2 - unitValue1);
      expect(result2.precision).toBe(highPrecision);
    });

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.sub(unit3);
      const zeroResult = unit1.sub(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 - unitValue3);
      expect(zeroResult.value).toBe(unitValue1);

      const negativeResult2 = unit3.sub(unit4)
      expect(negativeResult2.value).toBe(unitValue3 - unitValue4);

      const negativeResult3 = unit3.sub(unit1)
      expect(negativeResult3.value).toBe(unitValue3 - unitValue1);
    });
  });

  describe("mul method", () => {
    // Define test cases as [value1, precision1, value2, precision2, expectedProduct, expectedPrecision]
    const mulTestCases = [
      // Basic Multiplication
      [1.0, 6, 2.0, 6, 2.0, 6],
      [1.23, 6, 2.34, 6, 2.8782, 6],

      // Zero Multiplication
      [0.0, 6, 5.0, 6, 0.0, 6],
      [5.0, 6, 0.0, 6, 0.0, 6],

      // Negative Multiplication
      [-1.0, 6, 5.0, 6, -5.0, 6],
      [1.0, 6, -5.0, 6, -5.0, 6],
      [-1.0, 6, -5.0, 6, 5.0, 6],

      // Multiplying by One
      [1.0, 6, 5.0, 6, 5.0, 6],
      [5.0, 6, 1.0, 6, 5.0, 6],

      // Fraction Multiplication
      [0.01, 6, 0.01, 6, 0.0001, 6],
      [0.1, 6, 0.1, 6, 0.01, 6],

      // Large Number Multiplication
      [10000.0, 2, 10000.0, 2, 100000000.0, 2],

      // Precision Loss (assuming library truncates)
      [1.2345, 4, 9.8765, 4, 12.1925, 4],

      // Precision Mismatch
      [1.234, 5, 1.2345, 8, 1.523373, 8],

      // Underflow Handling
      [0.0000000001, 10, 0.0000000001, 10, 0.0, 10],

      // Multiplying with Powers of Ten
      [1.0, 2, 100.0, 2, 100.0, 2],

      // Rounding (assuming library truncates)
      [1.2345, 4, 1.0, 4, 1.2345, 4],
    ];

    test.each(mulTestCases)(
      "given numbers %f with precision %i and %f with precision %i, expect multiplication result %f with precision %i",
      (num1, precision1, num2, precision2, expectedNum, expectedPrecision) => {
        // Convert test case numbers to BigUnit instances

        const unit1 = BigUnit.from(num1, +precision1);
        const unit2 = BigUnit.from(num2, +precision2);
        const result = unit1.mul(unit2);

        // Convert expected number to BigInt representation
        const expectedValue = BigInt(
          Math.round(+expectedNum * 10 ** +expectedPrecision),
        );

        expect(result).toBeInstanceOf(BigUnit);
        expect(result.value).toBe(expectedValue);
        expect(result.toNumber()).toBe(+expectedNum);
        expect(result.precision).toBe(expectedPrecision);
      },
    );
  });

  describe("div method", () => {
    it("should divide various numbers with precision", () => {
      const testData = [
        // Basic Division
        [1.0, 6, 2.0, 6, 0.5, 6],
        [1.23, 6, 2.34, 6, 0.525641, 6],

        // Zero Division
        [0.0, 6, 5.0, 6, 0.0, 6],

        // Negative Division
        [-1.0, 6, 5.0, 6, -0.2, 6],
        [1.0, 6, -5.0, 6, -0.2, 6],
        [-1.0, 6, -5.0, 6, 0.2, 6],

        // Dividing by One
        [5.0, 6, 1.0, 6, 5.0, 6],

        // Fraction Division
        [0.01, 6, 0.01, 6, 1.0, 6],
        [0.1, 6, 0.1, 6, 1.0, 6],

        // Large Number Division
        [100000000000000000n, 2, 100000000000000000n, 2, 1.0, 2],

        // Precision Loss (assuming library truncates)
        // 1.23456 ÷ 9.87656 = 0.124998988
        [1.23456, 4, 9.87656, 4, 0.1249, 4],

        // Precision Mismatch
        [1.234, 5, 1.2345, 8, 0.99959497, 8],

        // JS math underflow handling
        // This ensures we do not lose precision when dividing very small numbers
        [0.0000000001, 10, 0.0000000001, 10, 1.0, 10],

        // Dividing with Powers of Ten
        [1.0, 2, 100.0, 2, 0.01, 2],
      ];
      // For each test,
      testData.forEach((test) => {
        const value1 = test[0];
        const precision1 = test[1] as number;
        const value2 = test[2];
        const precision2 = test[3] as number;

        const expectedNumberValue = test[4];
        const expectedPrecision = test[5];

        // Convert test case numbers to BigUnit instances
        const unit1 = BigUnit.from(value1, precision1);
        const unit2 = BigUnit.from(value2, precision2);
        const result = unit1.div(unit2);

        // Convert expected number to BigInt representation
        const expectedValue = BigInt(
          Math.round(
            (expectedNumberValue as number) *
              10 ** (expectedPrecision as number),
          ),
        );

        expect(result).toBeInstanceOf(BigUnit);
        expect(bigintCloseTo(result.value, expectedValue, 1n));
        expect(result.toNumber()).toBe(expectedNumberValue);
        expect(result.precision).toBe(expectedPrecision);
      });
    });
  });

  describe("mod method", () => {
    // Repeat the structure of add method tests for mod method
    it("should mod two BigUnit instances of the same precision", () => {
      const result = unit1.mod(unit2);
      expect(result.value).toBe(unitValue1 % unitValue2);
      expect(result.precision).toBe(precision);
    });

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.mod(unit3);
      expect(() => unit1.mod(zeroUnit)).toThrow();

      expect(negativeResult.value).toBe(unitValue1 % unitValue3);

      const negativeResult2 = unit3.mod(unit1)
      expect(negativeResult2.value).toBe(unitValue3 % unitValue1);
    });
  });

  describe("abs method", () => {
    test("should return a new BigUnit with the absolute value", () => {
      const unit1 = new BigUnit(-100n, 2);

      const result1 = unit1.abs();

      expect(result1.value).toBe(100n);
      expect(result1.precision).toBe(2);

      const unit2 = new BigUnit(100n, 2);

      const result2 = unit2.abs();

      expect(result2.value).toBe(100n);
      expect(result2.precision).toBe(2);
    });
  });

  describe("neg method", () => {
    test("should return a new BigUnit with the negated value", () => {
      const unit1 = new BigUnit(100n, 2);

      const result1 = unit1.neg();

      expect(result1.value).toBe(-100n);
      expect(result1.precision).toBe(2);

      const unit2 = new BigUnit(-100n, 2);

      const result2 = unit2.neg();

      expect(result2.value).toBe(100n);
      expect(result2.precision).toBe(2);
    });
  });
});

describe("BigUnit Class Methods - percent and fraction", () => {
  const precision = 2;
  const unitValue = 1000n; // 10.00 when precision is 2
  const bigUnit = new BigUnit(unitValue, precision);

  describe("percent method", () => {
    test("should calculate the percent correctly with a valid percentage", () => {
      const percentValue = 50; // 50%
      const result = bigUnit.percent(percentValue);
      const expectedValue = 500n; // 50% of 1000n is 500n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should handle zero percent correctly", () => {
      const percentValue = 0; // 0%
      const result = bigUnit.percent(percentValue);
      const expectedValue = 0n; // 0% of anything is 0n

      expect(result.value).toBe(expectedValue);
    });

    test("should handle negative percent correctly", () => {
      const percentValue = -50; // -50%
      const result = bigUnit.percent(percentValue);
      const expectedValue = -500n; // -50% of 1000n is -500n

      expect(result.value).toBe(expectedValue);
    });
  });

  describe("fraction method", () => {
    test("should calculate the fraction correctly with valid numerator and denominator", () => {
      const numerator = 1;
      const denominator = 4; // 1/4
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 250n; // 1/4 of 1000n is 250n

      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });

    test("should handle zero numerator correctly", () => {
      const numerator = 0;
      const denominator = 4; // 0/4
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = 0n; // 0/4 of anything is 0n

      expect(result.value).toBe(expectedValue);
    });

    test("should handle negative numerator correctly", () => {
      const numerator = -1;
      const denominator = 4; // -1/4
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -250n; // -1/4 of 1000n is -250n

      expect(result.value).toBe(expectedValue);
    });

    test("should handle zero denominator correctly", () => {
      const numerator = 1;
      const denominator = 0; // 1/0 should throw

      expect(() => {
        bigUnit.fraction(numerator, denominator);
      }).toThrow(DivisionByZeroError);
    });

    test("should handle negative denominator correctly", () => {
      const numerator = 1;
      const denominator = -4; // 1/-4
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -250n; // 1/-4 of 1000n is -250n

      expect(result.value).toBe(expectedValue);
    });
  });

  describe("BigUnit Class Methods - min and max", () => {
    const large = new BigUnit(1000n, 2);
    const small = new BigUnit(500n, 2);
    const negative = new BigUnit(-1000n, 2);

    test("should return the larger of the two units", () => {
      const result1 = BigUnit.max(large, small);
      expect(result1).toBe(large);

      const result2 = BigUnit.max(large, negative);
      expect(result2).toBe(large);
    });

    test("should return the smaller of the two units", () => {
      const result1 = BigUnit.min(large, small);
      expect(result1).toBe(small);

      const result2 = BigUnit.min(large, negative);
      expect(result2).toBe(negative);
    });
  });
});

// TODO: should these live with the rest of their respective tests?
describe("BigUnit Class Methods with Differing Precision", () => {
  const precisionHigh = 4; // Higher precision
  const precisionLow = 2; // Lower precision
  const unitHighPrecision = new BigUnit(1000n, precisionHigh); // e.g., 0.1000
  const unitLowPrecision = new BigUnit(500n, precisionLow); // e.g., 5.00

  describe("add method with differing precision", () => {
    test("should add two BigUnit instances and use the precision of the first instance", () => {
      const expectedValue =
        unitHighPrecision.value + unitLowPrecision.value * 100n; // Adjusted for precision

      const result1 = unitHighPrecision.add(unitLowPrecision);
      expect(result1.value).toBe(expectedValue);
      expect(result1.precision).toBe(precisionHigh);

      const result2 = unitLowPrecision.add(unitHighPrecision);
      expect(result2.value).toBe(expectedValue);
      expect(result2.precision).toBe(precisionHigh);
    });
  });

  describe("sub method with differing precision", () => {
    test("should subtract two BigUnit instances and use the precision of the first instance", () => {
      const expectedValue =
        unitHighPrecision.value - unitLowPrecision.value * 100n; // Adjusted for precision

      const result1 = unitHighPrecision.sub(unitLowPrecision);
      expect(result1.value).toBe(expectedValue);
      expect(result1.precision).toBe(precisionHigh);

      const result2 = unitLowPrecision.sub(unitHighPrecision);
      expect(result2.value).toBe(expectedValue * -1n);
      expect(result2.precision).toBe(precisionHigh);
    });
  });

  describe("mul method with differing precision", () => {
    test("should multiply two BigUnit instances and use the highest precision", () => {
      const result = unitHighPrecision.mul(unitLowPrecision);
      // The multiplication of the values themselves should not take precision into account, that's handled after the multiplication
      const rawProduct =
        unitHighPrecision.value *
        (unitLowPrecision.value * BigInt(10 ** (precisionHigh - precisionLow)));
      // Adjust the raw product by dividing it by 10^precisionHigh to maintain the precision of the first instance
      const expectedValue = rawProduct / BigInt(10 ** precisionHigh);
      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precisionHigh);
    });
  });

  describe("mod method with differing precision", () => {
    test("should mod two BigUnit instances and use the precision of the first instance", () => {
      const result1 = unitHighPrecision.mod(unitLowPrecision);
      // Mod operation should adjust the second unit to the precision of the first
      const adjustedUnitLowPrecisionValue1 =
        unitLowPrecision.value * BigInt(10 ** (precisionHigh - precisionLow));
      const expectedValue1 =
        unitHighPrecision.value % adjustedUnitLowPrecisionValue1;
      expect(result1.value).toBe(expectedValue1);
      expect(result1.precision).toBe(precisionHigh);

      const result2 = unitLowPrecision.mod(unitHighPrecision);
      // Mod operation should adjust the second unit to the precision of the first
      // This results in the second value here being 0n
      expect(result2.value).toBe(0n);
      expect(result2.precision).toBe(precisionHigh);
    });
  });
});
