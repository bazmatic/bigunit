import { BigUnit } from "../src/bigunit";
import {
  InvalidPrecisionError,
  InvalidValueTypeError,
  MissingPrecisionError,
} from "../src/errors";

describe("BigUnit Class Constructor", () => {
  test("should create a new BigUnit instance with valid arguments", () => {
    const value = 1000n; // bigint value
    const precision = 2;
    const name = "TestUnit";

    const unit = new BigUnit(value, precision, name);

    expect(unit).toBeInstanceOf(BigUnit);
    expect(unit.value).toBe(value);
    expect(unit.precision).toBe(precision);
    expect(unit.name).toBe(name);
  });

  test("should throw an error when non-integer precision is provided", () => {
    const value = 1000n; // bigint value
    const precision = 2.5; // non-integer precision
    const createUnit = () => new BigUnit(value, precision);

    expect(createUnit).toThrow(InvalidPrecisionError);
  });

  test("should throw an error when a negative precision is provided", () => {
    const value = 1000n; // bigint value
    const precision = -2; // negative precision
    const createUnit = () => new BigUnit(value, precision);

    expect(createUnit).toThrow(InvalidPrecisionError);
  });
});

describe("BigUnit Class Static Factory Methods", () => {
  const precision = 2;

  describe("fromBigInt method", () => {
    test("should convert BigInt to BigUnit with correct precision", () => {
      const bigIntValue = 12345n;
      const bigUnit = BigUnit.fromBigInt(bigIntValue, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.value).toBe(bigIntValue);
      expect(bigUnit.precision).toBe(precision);
    });
  });

  describe("fromNumber method", () => {
    test("should convert number to BigUnit with correct precision", () => {
      const numberValue = 123.45;
      const bigUnit = BigUnit.fromNumber(numberValue, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.toNumber()).toBeCloseTo(numberValue);
      expect(bigUnit.precision).toBe(precision);
    });
  });

  describe("fromDecimalString method", () => {
    test("should convert a decimal string to BigUnit with correct precision", () => {
      const decimalString = "123.45";
      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.toString()).toBe(decimalString);
      expect(bigUnit.precision).toBe(precision);
    });

    test("should handle decimal strings with leading zeros in the fractional part correctly", () => {
      const decimalString = "100.0123";
      const precision = 4;
      const expectedValue = BigInt(1000123); // Expected: 100 * 10^4 + 123

      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.value).toBe(expectedValue);
      expect(bigUnit.precision).toBe(precision);
    });

    test("should handle decimal strings without fractional part correctly", () => {
      const decimalString = "100.";
      const precision = 4;
      const expectedValue = BigInt(100 * 10 ** precision); // Expected: 100 * 10^4

      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.value).toBe(expectedValue);
      expect(bigUnit.precision).toBe(precision);
    });

    test("should handle decimal strings with fractional part shorter than precision correctly", () => {
      const decimalString = "100.1";
      const precision = 4;
      const expectedValue = BigInt(1001000); // Expected: 100 * 10^4 + 1000

      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.value).toBe(expectedValue);
      expect(bigUnit.precision).toBe(precision);
    });

    test("should truncate decimal strings with fractional part longer than precision", () => {
      const decimalString = "100.12345"; // Extra digit beyond precision
      const precision = 4;
      const expectedValue = BigInt(1001234); // Expected: 100 * 10^4 + 1234, last digit truncated

      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.value).toBe(expectedValue);
      expect(bigUnit.precision).toBe(precision);
    });
  });

  describe("from method", () => {
    test("should convert number to BigUnit with correct precision", () => {
      const numberValue = 123.45;
      const bigUnitFromNumber = BigUnit.from(numberValue, precision);

      expect(bigUnitFromNumber).toBeInstanceOf(BigUnit);
      expect(bigUnitFromNumber.toNumber()).toBeCloseTo(numberValue);
      expect(bigUnitFromNumber.precision).toBe(precision);
    });

    test("should convert a decimal string to BigUnit with correct precision", () => {
      const decimalString = "123.45";
      const bigUnitFromDecimalString = BigUnit.from(decimalString, precision);

      expect(bigUnitFromDecimalString).toBeInstanceOf(BigUnit);
      expect(bigUnitFromDecimalString.toString()).toBe(decimalString);
      expect(bigUnitFromDecimalString.precision).toBe(precision);

      const bigUnitFromDecimalString2 = BigUnit.from("789.12", 24);

      expect(bigUnitFromDecimalString2).toBeInstanceOf(BigUnit);
      expect(bigUnitFromDecimalString2.value).toBe(
        789120000000000000000000000n,
      );
    });

    test("should convert BigInt to BigUnit with correct precision", () => {
      const bigIntValue = 12345n;
      const bigUnitFromBigInt = BigUnit.from(bigIntValue, precision);

      expect(bigUnitFromBigInt).toBeInstanceOf(BigUnit);
      expect(bigUnitFromBigInt.value).toBe(bigIntValue);
      expect(bigUnitFromBigInt.precision).toBe(precision);
    });

    test("should convert BigUnit to BigUnit with correct precision", () => {
      const bigUnitValue = new BigUnit(12345n, 2);
      const bigUnitFromBigUnit = BigUnit.from(bigUnitValue, precision);

      expect(bigUnitFromBigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnitFromBigUnit.value).toBe(bigUnitValue.value);
      expect(bigUnitFromBigUnit.precision).toBe(precision);
    });

    test("should throw error when precision is not provided and input is not a BigUnit", () => {
      const numberValue = 123.45;
      const fromNumberWithoutPrecision = () => BigUnit.from(numberValue);

      expect(fromNumberWithoutPrecision).toThrow(MissingPrecisionError);
    });

    test("should handle invalid input types", () => {
      const invalidInput = { notANumber: true };
      const fromInvalidInput = () =>
        BigUnit.from(invalidInput as any, precision);

      expect(fromInvalidInput).toThrow(InvalidValueTypeError);
    });
  });

  describe("fromObject method", () => {
    test("should create a new BigUnit instance from an object", () => {
      const obj1 = {
        value: "1000",
        precision: 2,
        name: "TestUnit",
      };

      const obj2 = {
        value: "100000000000000000",
        precision: 18
      };

      const unit = BigUnit.fromObject(obj1);

      expect(unit).toBeInstanceOf(BigUnit);
      expect(unit.value).toBe(BigInt(obj1.value));
      expect(unit.precision).toBe(obj1.precision);
      expect(unit.name).toBe(obj1.name);

      const unit2 = BigUnit.fromObject(obj2);

      expect(unit2).toBeInstanceOf(BigUnit);
      expect(unit2.value).toBe(BigInt(obj2.value));
      expect(unit2.precision).toBe(obj2.precision);
      expect(unit2.name).toBeUndefined();
    });
  });
});
