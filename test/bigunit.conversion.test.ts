import { BigUnit } from "../src/bigunit";

describe("BigUnit Class Conversion and Formatting Methods", () => {
  /*TODO: All methods should include tests for:
    Negative numbers
    Values between 0 and 1. e.g. 12345n with 6 units of precision aka 0.012345
  */
  describe("toNumber method", () => {
    test("should correctly convert BigUnit instances to numbers for various precisions", () => {
      const unit1 = new BigUnit(12345n, 2); // 123.45
      const unit2 = new BigUnit(12345n, 3); // 12.345
      const unit3 = new BigUnit(12345n, 0); // 12345 (zero precision)

      expect(unit1.toNumber()).toBe(123.45);
      expect(unit2.toNumber()).toBe(12.345);
      expect(unit3.toNumber()).toBe(12345);
    });
    test("should handle very small BigUnit values correctly", () => {
      const verySmallValue = 1n; // Represents a very small value when precision is high
      const highPrecision = 20; // A precision that would make the value very small
      const verySmallUnit = new BigUnit(verySmallValue, highPrecision);
      const expectedNumber = Number(verySmallValue) / 10 ** highPrecision;
      //TODO: I think we chose to preference explicitly defining values rather than calculating them like is done here with expectedNumber

      expect(verySmallUnit.toNumber()).toBe(expectedNumber);
      expect(verySmallUnit.toNumber()).toBeGreaterThan(0);
    });

    test("should correctly convert an unsafe BigUnit value to a number, with truncation", () => {
      //TODO: because this BigUnit has a precision of 2, both the integer and decimal portions of the number remain below the max_safe_integer limit. I would like to see a test where both integer and decimal portions are above max_safe_integer
      const precision = 2;
      const safeValue = BigInt(Number.MAX_SAFE_INTEGER - 1); // A safe bigint value just below the max safe integer
      const unsafeValue = safeValue * BigInt(10); // An unsafe bigint value above the max safe integer

      const unsafeUnit = new BigUnit(unsafeValue, precision);
      const valueString = unsafeValue.toString();
      const safeDigits =
        valueString.length -
        (valueString.length - Number.MAX_SAFE_INTEGER.toString().length);
      const truncatedValueString = valueString.slice(0, safeDigits);
      const truncatedValueBigInt = BigInt(truncatedValueString);
      const expectedNumber =
        Number(truncatedValueBigInt) /
        10 ** (precision - (valueString.length - safeDigits));
      
      //TODO: I think we chose to preference explicitly defining values rather than calculating them like is done here with expectedNumber

      expect(unsafeUnit.toNumber()).toBe(expectedNumber);
    });
  });

  describe("toString method", () => {
    test("should correctly represent BigUnit as a string for various precisions", () => {
      const unit1 = new BigUnit(12345n, 2); // "123.45"
      const unit2 = new BigUnit(12345n, 3); // "12.345"
      const unit3 = new BigUnit(12345n, 0); // "12345" (zero precision)

      expect(unit1.toString()).toBe("123.45");
      expect(unit2.toString()).toBe("12.345");
      expect(unit3.toString()).toBe("12345");
    });
  });

  describe("toBigInt method", () => {
    test("should correctly convert BigUnit to BigInt", () => {
      const value = 12345n;
      const unit = new BigUnit(value, 2);

      expect(unit.toBigInt()).toBe(value);
    });
  });

  describe("format method", () => {
    //TODO: Unlikely to cause issues but should probably include a test for formatting to the same number of decimals as the units native precision
    test("should format BigUnit to a string with given precision", () => {
      const unit = new BigUnit(12345n, 2); // 123.45

      expect(unit.format(1)).toBe("123.5");
      expect(unit.format(3)).toBe("123.450");
    });

    test("should handle zero precision in format method", () => {
      const unit = new BigUnit(12345n, 2); // 123.45

      expect(unit.format(0)).toBe("123");
    });
  });
});
