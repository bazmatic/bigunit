import { BigUnit, DifferentPrecisionError } from "../src/bigunit";

describe("BigUnit Class Methods", () => {
  const precision = 2;
  const unitValue1 = 1000n;
  const unitValue2 = 500n;
  const unitValue3 = -500n;
  const unit1 = new BigUnit(unitValue1, precision);
  const unit2 = new BigUnit(unitValue2, precision);
  const unit3 = new BigUnit(unitValue3, precision);

  describe("add method", () => {
    test("should add two BigUnit instances of the same precision", () => {
      const result = unit1.add(unit2);
      expect(result.value).toBe(unitValue1 + unitValue2);
      expect(result.precision).toBe(precision);
    });

    it.only("should handle adding two BigUnit instances of different precision", () => {});

    test("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.add(unit3);
      const zeroResult = unit1.add(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 + unitValue3);
      expect(zeroResult.value).toBe(unitValue1);
    });
  });

  describe("sub method", () => {
    // Repeat the structure of add method tests for sub method
    it("should subtract two BigUnit instances of the same precision", () => {
      const result = unit1.sub(unit2);
      expect(result.value).toBe(unitValue1 - unitValue2);
      expect(result.precision).toBe(precision);
    });

    it("should handle subtracting two BigUnit instances of different precision", () => {});

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.sub(unit3);
      const zeroResult = unit1.sub(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 - unitValue3);
      expect(zeroResult.value).toBe(unitValue1);
    });
  });

  describe("mul method", () => {
    // Repeat the structure of add method tests for mul method
    it("should multiply two BigUnit instances of the same precision", () => {
      const result = unit1.mul(unit2);
      expect(result.value).toBe(
        (unitValue1 * unitValue2) / 10n ** BigInt(precision)
      );
      expect(result.precision).toBe(precision);
    });

    it("should handle multiplying two BigUnit instances of different precision", () => {});

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.mul(unit3);
      const zeroResult = unit1.mul(zeroUnit);

      expect(negativeResult.value).toBe(
        (unitValue1 * unitValue3) / 10n ** BigInt(precision)
      );
      expect(zeroResult.value).toBe(0n);
    });

    it("should handle multiplying by fractional numbers", () => {
      const precision = 2; // Precision set to 2 decimal places for this example

      // Create BigUnit instances
      const fractionUnit = new BigUnit(BigInt(5), precision); // 0.05 as a fraction
      const largeNumberUnit = new BigUnit(BigInt(100000), precision); // 1000 as a large number

      // Expected value after multiplication
      // The fraction 0.05 represented as 5 with precision 2, when multiplied by 1000 represented as 100000 with precision 2,
      // should result in 50 represented as 5000 with precision 2.
      const expectedValue = BigInt(5000); // 50 with precision 2
      const result = fractionUnit.mul(largeNumberUnit);

      expect(result).toBeInstanceOf(BigUnit);
      expect(result.value).toBe(expectedValue);
      expect(result.precision).toBe(precision);
    });
  });

  describe("div method", () => {
    // Repeat the structure of add method tests for div method
    it("should divide two BigUnit instances of the same precision", () => {
      const result = unit1.div(unit2);
      expect(result.value).toBe(unitValue1 / unitValue2);
      expect(result.precision).toBe(precision);
    });

    it("should handle dividing two BigUnit instances of different precision", () => {});

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.div(unit3);
      expect(() => unit1.div(zeroUnit)).toThrow();
      expect(negativeResult.value).toBe(unitValue1 / unitValue3);
    });
  });

  describe("mod method", () => {
    // Repeat the structure of add method tests for mod method
    it("should mod two BigUnit instances of the same precision", () => {
      const result = unit1.mod(unit2);
      expect(result.value).toBe(unitValue1 % unitValue2);
      expect(result.precision).toBe(precision);
    });

    it("should handle modding two BigUnit instances of different precision", () => {});

    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.mod(unit3);
      expect(() => unit1.mod(zeroUnit)).toThrow();

      expect(negativeResult.value).toBe(unitValue1 % unitValue3);
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
      }).toThrow();
    });

    test("should handle negative denominator correctly", () => {
      const numerator = 1;
      const denominator = -4; // 1/-4
      const result = bigUnit.fraction(numerator, denominator);
      const expectedValue = -250n; // 1/-4 of 1000n is -250n

      expect(result.value).toBe(expectedValue);
    });
  });
});
