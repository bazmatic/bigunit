import { BigUnit, RoundingMethod } from "../src/bigunit";

describe("BigUnit Class Precision Conversion Methods", () => {
  const initialPrecision = 2;
  const bigUnit = BigUnit.from(123.45, initialPrecision); //BigUnit(initialVal, initialPrecision);
  let initialVal = 12345n;

  describe("asPrecision method", () => {
    test("should return a BigUnit with the same precision when converted to the same precision", () => {
      const newUnit = bigUnit.asPrecision(initialPrecision);
      expect(newUnit.precision).toBe(initialPrecision);
      expect(newUnit.value).toBe(initialVal);
    });

    test("should return a BigUnit with a higher precision when converted to a higher precision", () => {
      const higherPrecision = 4;
      const newUnit = bigUnit.asPrecision(higherPrecision);
      const expectedValue = initialVal * 100n; // Adjusting for the 2 decimal places increase in precision
      expect(newUnit.precision).toBe(higherPrecision);
      expect(newUnit.value).toBe(expectedValue);
    });

    test("should return a BigUnit with a lower precision when converted to a lower precision", () => {
      const lowerPrecision = 0;
      const newUnit = bigUnit.asPrecision(lowerPrecision);
      const expectedValue = initialVal / 100n; // Adjusting for the 2 decimal places decrease in precision
      expect(newUnit.precision).toBe(lowerPrecision);
      expect(newUnit.value).toBe(expectedValue);
    });
  });

  describe("asOtherPrecision with rounding", () => {
    test("should round down when the digit after precision is less than 5", () => {
      const unit = BigUnit.from(123.4541, 4); // The next digit after the third decimal is less than 5
      const newUnit = unit.asPrecision(3, RoundingMethod.Round);
      expect(newUnit.precision).toBe(3);
      expect(newUnit.toBigInt()).toBe(BigInt(123454)); // Should round down to 123.454
      expect(newUnit.toNumber()).toBeCloseTo(123.454);
    });

    test("should round up when the digit after precision is 5 or more", () => {
      const unit = BigUnit.from(123.4555, 4); // The next digit after the third decimal is 5
      const newUnit = unit.asPrecision(3, RoundingMethod.Round);
      expect(newUnit.precision).toBe(3);
      expect(newUnit.toBigInt()).toBe(BigInt(123456)); // Should round up to 123.456
      expect(newUnit.toNumber()).toBeCloseTo(123.456);
    });

    test("should round up when converting to a lower precision using RoundingMethod.Ceil", () => {
      const unit = BigUnit.from(123.4512, 4); // A value where the next significant digit after truncation is not zero
      const newUnit = unit.asPrecision(3, RoundingMethod.Ceil);
      expect(newUnit.precision).toBe(3);
      expect(newUnit.toBigInt()).toBe(BigInt(123452)); // Should ceil to 123.452
      expect(newUnit.toNumber()).toBeCloseTo(123.452);
    });

    test("should round down when converting to a lower precision using RoundingMethod.Floor", () => {
      const unit = BigUnit.from(123.4567, 4); // A value where the next significant digit after truncation would normally round up
      const newUnit = unit.asPrecision(3, RoundingMethod.Floor);
      expect(newUnit.precision).toBe(3);
      expect(newUnit.toBigInt()).toBe(BigInt(123456)); // Should floor to 123.456
      expect(newUnit.toNumber()).toBeCloseTo(123.456);
    });

    test("should truncate when converting to a lower precision using RoundingMethod.Trunc", () => {
      const unit = BigUnit.from(123.4599, 4); // A value that would normally round up
      const newUnit = unit.asPrecision(3, RoundingMethod.None);
      expect(newUnit.precision).toBe(3);
      expect(newUnit.toBigInt()).toBe(BigInt(123459)); // Should truncate to 123.459
      expect(newUnit.toNumber()).toBeCloseTo(123.459);
    });
  });

  describe("asOtherPrecision method", () => {
    test("should convert to the same precision when the other BigUnit has the same precision", () => {
      const otherUnit = new BigUnit(6789n, initialPrecision);
      const newUnit = bigUnit.asOtherPrecision(otherUnit);
      expect(newUnit.precision).toBe(initialPrecision);
      expect(newUnit.value).toBe(initialVal);
    });

    test("should convert to a higher precision when the other BigUnit has a higher precision", () => {
      const otherUnit = new BigUnit(6789n, 4); // higher precision
      const newUnit = bigUnit.asOtherPrecision(otherUnit);
      const expectedValue = initialVal * 100n; // Adjusting for the precision difference
      expect(newUnit.precision).toBe(otherUnit.precision);
      expect(newUnit.value).toBe(expectedValue);
    });

    test("should convert to a lower precision when the other BigUnit has a lower precision", () => {
      const otherUnit = new BigUnit(67n, 0); // lower precision
      const newUnit = bigUnit.asOtherPrecision(otherUnit);
      const expectedValue = initialVal / 100n; // Adjusting for the precision difference
      expect(newUnit.precision).toBe(otherUnit.precision);
      expect(newUnit.value).toBe(expectedValue);
    });
  });

  test("Miscellaneous tests", () => {
    const numberInput = 234.39923;
    const unit1 = BigUnit.from(numberInput, 18);
    const val = unit1.toBigInt();
    expect(val).toEqual(234399230000000000000n);
    const num = unit1.toNumber();
    expect(num).toEqual(numberInput);
  });
});
