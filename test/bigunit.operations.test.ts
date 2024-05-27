import { BigUnit } from "../src/bigunit";
import { DivisionByZeroError, MissingPrecisionError } from "../src/errors";
import { bigintCloseTo } from "../src/utils";

describe("BigUnit Class Methods", () => {
  const precision = 2;
  const highPrecision = 10;
  const unitValue1 = 1000n;
  const unitValue2 = 500n;
  const unitValue3 = -500n;
  const unitValue4 = -1000n;
  const unit1 = new BigUnit(unitValue1, precision); //10.00
  const unit2 = new BigUnit(unitValue2, precision); //5.00
  const unit3 = new BigUnit(unitValue3, precision); //-5.00
  const unit4 = new BigUnit(unitValue4, precision); //-10.00

  const unit5 = new BigUnit(unitValue1, highPrecision);
  const unit6 = new BigUnit(unitValue2, highPrecision);
  const unit7 = new BigUnit(unitValue2, precision);

  describe("add method", () => {
    test("should add two BigUnit instances of the same precision", () => {
      const result1 = unit1.add(unit2);
      expect(result1.value).toBe(unitValue1 + unitValue2);
      expect(result1.precision).toBe(precision);
    });

    test("should add two BigUnit instances of differing precision", () => {
      const result1 = unit5.add(unit7);
      expect(result1.value).toBe(50000001000n);
      expect(result1.precision).toBe(highPrecision);

      const result2 = unit7.add(unit6);
      expect(result2.value).toBe(50000000500n);
      expect(result2.precision).toBe(highPrecision);
    });

    test("should add two BigUnit instances, respecting a precision override", () => {
      const unitA = BigUnit.fromNumber(1000, 10);
      const unitB = BigUnit.fromNumber(1000.001, 10);
      const result = unitA.add(unitB, 2);
      expect(result.toNumber()).toBe(2000.0);
    });

    test("require precision if other unit is a bigint", () => {
      // Expect to throw a MissingPrecisionError
      expect(() => {
        unit1.add(1000n);
      }).toThrow(MissingPrecisionError);

      const result = unit1.add(new BigUnit(1000n, precision));
      expect(result.value).toBe(unitValue1 + 1000n);
    });

    test("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult1 = unit1.add(unit3);
      const zeroResult = unit1.add(zeroUnit);

      expect(negativeResult1.value).toBe(unitValue1 + unitValue3);
      expect(zeroResult.value).toBe(unitValue1);

      const negativeResult2 = unit3.add(unit4);
      expect(negativeResult2.value).toBe(unitValue3 + unitValue4);

      const negativeResult3 = unit3.add(unit1);
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
      const result1 = unit5.sub(unit7);
      expect(result1.value).toBe(-49999999000n);
      expect(result1.precision).toBe(highPrecision);

      const result2 = unit7.sub(unit6);
      expect(result2.value).toBe(49999999500n);
      expect(result2.precision).toBe(highPrecision);
    });

    test("should subtract two BigUnit instances, respecting a precision override", () => {
      const unitA = BigUnit.fromNumber(1000, 10);
      const unitB = BigUnit.fromNumber(100.001, 10);
      const result = unitA.sub(unitB, 2);
      expect(result.toNumber()).toBe(900.0);
    });

    test("require precision if other unit is a bigint", () => {
      // Expect to throw a MissingPrecisionError
      expect(() => {
        unit1.sub(1000n);
      }).toThrow(MissingPrecisionError);

      const result = unit1.sub(new BigUnit(1000n, precision));
      expect(result.value).toBe(unitValue1 - 1000n);
    });

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.sub(unit3);
      const zeroResult = unit1.sub(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 - unitValue3);
      expect(zeroResult.value).toBe(unitValue1);

      const negativeResult2 = unit3.sub(unit4);
      expect(negativeResult2.value).toBe(unitValue3 - unitValue4);

      const negativeResult3 = unit3.sub(unit1);
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
        const expectedValue = BigInt(Math.round(+expectedNum * 10 ** +expectedPrecision));

        expect(result).toBeInstanceOf(BigUnit);
        expect(result.value).toBe(expectedValue);
        expect(result.toNumber()).toBe(+expectedNum);
        expect(result.precision).toBe(expectedPrecision);
      },
    );

    test("should allow doing operations with BigUnit without precision", () => {
      const unitA = BigUnit.from(82.1, 10);
      expect(() => unitA.mul(99)).not.toThrow();
      expect(() => unitA.div(99)).not.toThrow();
      expect(() => unitA.add(99)).not.toThrow();
      expect(() => unitA.sub(99)).not.toThrow();
      expect(() => unitA.percentBackout(99)).not.toThrow();
      expect(() => unitA.mod(99)).not.toThrow();
    });

    describe("should do operations respecting a precision override", () => {
      describe("multiply", () => {
        const mulRespectingPrecisionOverride = [
          // num1, precision1, num2, precision2, overrideprecision, expectedString
          // two numbers with the same precision
          [100.1, 5, 1.23456, 5, 1, "120.12000"], // = 100.10000 * 1.2
          // two numbers with the different precision
          [1.23456, 5, 10.999, 3, 2, "13.56781"], // = 1.23456 * 10.99
          // zero multiplied by a number
          [0, 9, 0.5, 4, 3, "0.000000000"], // = 0.000000000 * 0.500
          // has a negative number and override precision is larger than either inputs precision
          [1.00010001, 9, -0.5656, 4, 10, "-0.5656565656"], // = 1.000100010 * 0.5656000000
        ];
        test.each(mulRespectingPrecisionOverride)(
          "rodo: should multiply two BigUnit instances, number %f with precision %i and number %f with precision %i, respecting a precision override of %i and result in %s",
          (num1, precision1, num2, precision2, overrideprecision, expectedString) => {
            const unitA = BigUnit.from(num1, +precision1);
            const unitB = BigUnit.from(num2, +precision2);
            const result = unitA.mul(unitB, +overrideprecision);
            expect(result.toString()).toBe(expectedString);
          },
        );
      });

      describe("divide", () => {
        const divRespectingPrecisionOverride = [
          // num1, precision1, num2, precision2, overrideprecision, expectedString
          [120.1, 5, 1.23456, 5, 1, "100.08333"], // 120.10000 / 1.2 = 100.08333333 => "100.08333"
          // zero divided by a number
          [0, 4, 5.555, 2, 2, "0.0000"],
          // override precision is higher
          [555, 2, 5.55, 2, 5, "100.00000"],
          // override precision is lower
          [555, 2, 5.55, 2, 1, "100.90"], // 555.00 / 5.5
          // has a negative number
          [-5, 2, 0.125, 3, 5, "-40.00000"], // -5.00 / 0.12500
        ];
        test.each(divRespectingPrecisionOverride)(
          "rodo: should divide two BigUnit instances, number %f with precision %i and number %f with precision %i, respecting a precision override of %i and result in %s",
          (num1, precision1, num2, precision2, overrideprecision, expectedString) => {
            const unitA = BigUnit.from(num1, +precision1);
            const unitB = BigUnit.from(num2, +precision2);
            const result = unitA.div(unitB, +overrideprecision);
            expect(result.toString()).toBe(expectedString);
          },
        );
      });

      describe("addition", () => {
        const addRespectingPrecisionOverride = [
          // num1, precision1, num2, precision2, overrideprecision, expectedString
          // override precision is lower
          [100.1, 5, 0.91234, 5, 1, "101.00000"],
          // override precision is higher
          [10.9, 3, 1.23, 2, 4, "12.1300"],
          // override precision is 0
          [1.2, 1, 10.99, 2, 0, "11.2"],
          // has a negative number
          [-5, 2, 1.23, 2, 2, "-3.77"],
        ];
        test.each(addRespectingPrecisionOverride)(
          "rodo: should add two BigUnit instances, number %f with precision %i and number %f with precision %i, respecting a precision override of %i and result in %s",
          (num1, precision1, num2, precision2, overrideprecision, expectedString) => {
            const unitA = BigUnit.from(num1, +precision1);
            const unitB = BigUnit.from(num2, +precision2);
            const result = unitA.add(unitB, +overrideprecision);
            expect(result.toString()).toBe(expectedString);
          },
        );
      });

      describe("subtraction", () => {
        const subRespectingPrecisionOverride = [
          // num1, precision1, num2, precision2, overrideprecision, expectedString
          // override precision is lower
          [100.1, 5, 0.91234, 5, 1, "99.20000"],
          // override precision is higher
          [10.9, 3, 1.23, 2, 4, "9.6700"],
          // override precision is 0
          [1.2, 1, 10.99, 2, 0, "-8.8"],
          // has a negative number
          [-5, 2, 1.23, 2, 2, "-6.23"],
          // a rather high precision
          [0.000000000001, 12, 0.0000000000001, 13, 11, "0.000000000001"],
        ];
        test.each(subRespectingPrecisionOverride)(
          "rodo: should subtract two BigUnit instances, number %f with precision %i and number %f with precision %i, respecting a precision override of %i and result in %s",
          (num1, precision1, num2, precision2, overrideprecision, expectedString) => {
            const unitA = BigUnit.from(num1, +precision1);
            const unitB = BigUnit.from(num2, +precision2);
            const result = unitA.sub(unitB, +overrideprecision);
            expect(result.toString()).toBe(expectedString);
          },
        );
      });

      describe("percentBackout", () => {
        const percentBackoutRespectingPrecisionOverride = [
          // NOTE: percentageBackout should return as the precision of the 
          // num1, precision1, num2, overrideprecision, expectedString
          // override precision is higher precision than num2
          [100.1, 2, 0.1, 4, "100.00"],
          // override precision is lower precision than num2
          [15.00015, 5, 50.0012, 2, "10.00010"],
          //override precision is lower than precision1
          [15.00015, 5, 50.0012, 2, "10.00010"],
          //override precision is higher than precision1
          [1002.5, 1, 0.25, 2, "1000.0"],
          // override precision is 0
          [2.2, 1, 10.9, 0, "2.0"],
          // has a negative number
          [-150, 0, -50, 0, "100"],
          // another combination of negative numbers
          [150, 0, -50, 0, "-100"],
          // final combination of negative numbers
          [-150, 0, 50, 0, "-100"],
          // has a more complex negative number
          [3.33333, 5, -0.1, 1, "-3.33000"],
          // a rather high precision
          [12.000000000006, 12, 0.00000000005, 11, "12.000000000000"],
        ];
        test.each(percentBackoutRespectingPrecisionOverride)(
          "rodo: should percentBackout two BigUnit instances, number %f with precision %i and number %f with precision %i, respecting a precision override of %i and result in %s",
          (num1, precision1, num2, overrideprecision, expectedString) => {
            const unitA = BigUnit.from(num1, +precision1);
            const result = unitA.percentBackout(+num2, +overrideprecision);
            expect(result.toString()).toBe(expectedString);
          },
        );
      });

      describe("mod", () => {
        const modRespectingPrecisionOverride = [
          // num1, precision1, num2, overrideprecision, expectedString
          // override precision is lower
          [100.1, 5, 1, 5, 5, "0.10000"],
          // override precision is higher
          [10.9, 3, 1.0, 3, 6, "0.900000"],
          // override precision is 0
          [1.2, 1, 1.11, 2, 0, "0.2"],
          // has a negative number, high precision
          [-5, 2, 0.999999999999, 12, 13, "-0.0000000000050"],
        ];
        test.each(modRespectingPrecisionOverride)(
          "rodo: should mod two BigUnit instances, number %f with precision %i and number %f with precision %i, respecting a precision override of %i and result in %s",
          (num1, precision1, num2, precision2, overrideprecision, expectedString) => {
            const unitA = BigUnit.from(num1, +precision1);
            const unitB = BigUnit.from(num2, +precision2);
            const result = unitA.mod(+unitB, +overrideprecision);
            expect(result.toString()).toBe(expectedString);
          },
        );
      });
    });

    test("require precision if other unit is a bigint", () => {
      // Expect to throw a MissingPrecisionError
      expect(() => {
        unit1.mul(1000n);
      }).toThrow(MissingPrecisionError);
      expect(() => {
        unit1.div(1000n);
      }).toThrow(MissingPrecisionError);
      expect(() => {
        unit1.add(1000n);
      }).toThrow(MissingPrecisionError);
      expect(() => {
        unit1.sub(1000n);
      }).toThrow(MissingPrecisionError);
      expect(() => {
        unit1.mod(1000n);
      }).toThrow(MissingPrecisionError);

      const result = unit1.mul(new BigUnit(1000n, precision));
      expect(result.toNumber()).toBe(100);
    });
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
        const expectedValue = BigInt(Math.round((expectedNumberValue as number) * 10 ** (expectedPrecision as number)));

        expect(result).toBeInstanceOf(BigUnit);
        expect(bigintCloseTo(result.value, expectedValue, 1n));
        expect(result.toNumber()).toBe(expectedNumberValue);
        expect(result.precision).toBe(expectedPrecision);
      });
    });

    test("should divide two BigUnit instances, respecting a precision override", () => {
      const unitA = BigUnit.fromNumber(1000, 10);
      const unitB = BigUnit.fromNumber(2.001, 10);
      const result = unitA.div(unitB, 2);
      expect(result.toNumber()).toBe(500.0);
    });

    test("require precision if other unit is a bigint", () => {
      // Expect to throw a MissingPrecisionError
      expect(() => {
        unit1.div(200n);
      }).toThrow(MissingPrecisionError);

      // 10 / 2 = 5
      const result = unit1.div(new BigUnit(200n, precision));
      expect(result.toNumber()).toBe(5);
    });
  });

  describe("mod method", () => {
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

      const negativeResult2 = unit3.mod(unit1);
      expect(negativeResult2.value).toBe(unitValue3 % unitValue1);
    });

    it("should mod two BigUnit instances of the differing precision", () => {
      const result1 = unit5.mod(unit7);
      expect(result1.value).toBe(1000n);
      expect(result1.precision).toBe(highPrecision);

      const result2 = unit7.mod(unit6);
      expect(result2.value).toBe(0n);
      expect(result2.precision).toBe(highPrecision);
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

  describe("percentBackout method", () => {
    test("should calculate the percent backout correctly with a valid percentage", () => {
      const amountWithGst = BigUnit.fromNumber(110.0, 4); // Make sure the precision matches throughout
      const result = amountWithGst.percentBackout(10.0);
      expect(result.toNumber()).toBeCloseTo(100.0); // Use toBeCloseTo for floating point precision issues
    });

    test("should handle zero percent correctly", () => {
      const amountWithGst = BigUnit.fromNumber(110.0, 4);
      const result = amountWithGst.percentBackout(0.0);
      expect(result.toNumber()).toBeCloseTo(110.0);
    });

    test("should handle precision override correctly", () => {
      const amountWithGst = BigUnit.fromNumber(110.0011, 4);
      const result = amountWithGst.percentBackout(10.0, 2);
      expect(result.toNumber()).toBeCloseTo(100.0);
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
      const expectedValue = unitHighPrecision.value + unitLowPrecision.value * 100n; // Adjusted for precision

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
      const expectedValue = unitHighPrecision.value - unitLowPrecision.value * 100n; // Adjusted for precision

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
        unitHighPrecision.value * (unitLowPrecision.value * BigInt(10 ** (precisionHigh - precisionLow)));
      // Adjust the raw product by dividing it by 10^precisionHigh to maintain the precision of the first instance
      const expectedValue = rawProduct / BigInt(10 ** precisionHigh);
      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precisionHigh);
    });
  });

  //TODO: We seem to be missing a test for division

  describe("mod method with differing precision", () => {
    test("should mod two BigUnit instances and use the precision of the first instance", () => {
      const result1 = unitHighPrecision.mod(unitLowPrecision);
      // Mod operation should adjust the second unit to the precision of the first
      const adjustedUnitLowPrecisionValue1 = unitLowPrecision.value * BigInt(10 ** (precisionHigh - precisionLow));
      const expectedValue1 = unitHighPrecision.value % adjustedUnitLowPrecisionValue1;
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

describe("BigUnit Class Methods with high precision", () => {
  const precision = 23;
  const unit1 = new BigUnit(10000000000000000000000000n, precision); // e.g., 100.00000000000000000000000
  const unit2 = new BigUnit(200000000000000000000000n, precision); // e.g., 2.00000000000000000000000

  describe("add method with high precision", () => {
    test("should add two BigUnit instances with high precision", () => {
      const result = unit1.add(unit2);
      expect(result.value).toBe(10200000000000000000000000n); // e.g., 102.00000000000000000000000
      expect(result.precision).toBe(precision);
    });
  });

  describe("sub method with high precision", () => {
    test("should subtract two BigUnit instances with high precision", () => {
      const result = unit1.sub(unit2);
      expect(result.value).toBe(9800000000000000000000000n); // e.g., 98.00000000000000000000000
      expect(result.precision).toBe(precision);
    });
  });

  describe("mul method with high precision", () => {
    test("should multiply two BigUnit instances with high precision", () => {
      const result = unit1.mul(unit2);
      expect(result.value).toBe(20000000000000000000000000n); // e.g., 200.00000000000000000000000
      expect(result.precision).toBe(precision);
    });
  });

  describe("div method with high precision", () => {
    test("should divide two BigUnit instances with high precision", () => {
      const result = unit1.div(unit2);
      expect(result.value).toBe(5000000000000000000000000n); // e.g., 50.00000000000000000000000
      expect(result.precision).toBe(precision);
    });
  });

  describe("mod method with high precision", () => {
    test("should mod two BigUnit instances with high precision", () => {
      const result = unit1.mod(unit2);
      expect(result.value).toBe(0n); // e.g., 0.00000000000000000000000
      expect(result.precision).toBe(precision);
    });

    test("should mod two BigUnit instances with high precision (units swapped)", () => {
      const result = unit2.mod(unit1);
      expect(result.value).toBe(200000000000000000000000n); // e.g., 2.00000000000000000000000
      expect(result.precision).toBe(precision);
    });
  });
});
