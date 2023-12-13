import { BigUnit } from "../src/bigunit";

describe("BigUnit Class Conversion and Formatting Methods", () => {
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

      expect(verySmallUnit.toNumber()).toBe(expectedNumber);
      expect(verySmallUnit.toNumber()).toBeGreaterThan(0);
    });

    test("should correctly convert an unsafe BigUnit value to a number, with truncation", () => {
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

      expect(unsafeUnit.toNumber()).toBe(expectedNumber);
    });
  });

  describe("toString method", () => {
    test("should correctly represent BigUnit as a string for various precisions", () => {
      const unit1 = new BigUnit(12345n, 2); // "123.45"
      const unit2 = new BigUnit(12345n, 3); // "12.345"
      const unit3 = new BigUnit(12345n, 0); // "12345" (zero precision)
      const unit4 = new BigUnit(12345n, 5); // "0.12345"

      expect(unit1.toString()).toBe("123.45");
      expect(unit2.toString()).toBe("12.345");
      expect(unit3.toString()).toBe("12345");
      expect(unit4.toString()).toBe("0.12345");
    });

    test("should correctly represent BigUnit as a string for negative numbers", () => {
      const unit1 = BigUnit.from(-1234n, 8); // -0.0001234

      expect(unit1.toString()).toBe("-0.0001234");
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
    test("should format BigUnit to a string with given precision", () => {
      const unit1 = new BigUnit(12345n, 2); // 123.45
      const unit2 = new BigUnit(12345n, 3); // 12.345
      const unit3 = new BigUnit(12345n, 0); // 12345 (zero precision)

      expect(unit1.format(1)).toBe("123.5");
      expect(unit1.format(3)).toBe("123.450");
      expect(unit1.format(18)).toBe("123.450000000000000000");

      expect(unit2.format(1)).toBe("12.3");
      expect(unit2.format(4)).toBe("12.3450");
      expect(unit2.format(10)).toBe("12.3450000000");

      expect(unit3.format(0)).toBe("12345");
      expect(unit3.format(5)).toBe("12345.00000");
      expect(unit3.format(8)).toBe("12345.00000000");
    });

    test("should handle zero precision in format method", () => {
      const unit = new BigUnit(12345n, 2); // 123.45

      expect(unit.format(0)).toBe("123");
    });

    test("should handle rounding correctly", () => {
      const unit1 = new BigUnit(12345n, 2); // 123.45
      const unit2 = new BigUnit(12345n, 3); // 12.345
      const unit3 = new BigUnit(12345n, 0); // 12345 (zero precision)

      expect(unit1.format(1)).toBe("123.5");
      expect(unit1.format(2)).toBe("123.45");
      expect(unit1.format(3)).toBe("123.450");
      expect(unit1.format(4)).toBe("123.4500");

      expect(unit2.format(1)).toBe("12.3");
      expect(unit2.format(2)).toBe("12.35");
      expect(unit2.format(3)).toBe("12.345");
      expect(unit2.format(4)).toBe("12.3450");

      expect(unit3.format(0)).toBe("12345");
      expect(unit3.format(1)).toBe("12345.0");
      expect(unit3.format(2)).toBe("12345.00");
      expect(unit3.format(3)).toBe("12345.000");
    });
  });
});
