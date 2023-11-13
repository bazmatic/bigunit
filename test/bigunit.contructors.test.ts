import { BigUnit, InvalidPrecisionError, InvalidValueTypeError, MissingPrecisionError } from "../src/bigunit";

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
});


describe('BigUnit Class Static Factory Methods', () => {
  const precision = 2;
  
  describe('fromBigInt method', () => {
    test('should convert BigInt to BigUnit with correct precision', () => {
      const bigIntValue = 12345n;
      const bigUnit = BigUnit.fromBigInt(bigIntValue, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.value).toBe(bigIntValue);
      expect(bigUnit.precision).toBe(precision);
    });
  });

  describe('fromNumber method', () => {
    test('should convert number to BigUnit with correct precision', () => {
      const numberValue = 123.45;
      const bigUnit = BigUnit.fromNumber(numberValue, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.toNumber()).toBeCloseTo(numberValue);
      expect(bigUnit.precision).toBe(precision);
    });
  });

  describe('fromDecimalString method', () => {
    test('should convert a decimal string to BigUnit with correct precision', () => {
      const decimalString = "123.45";
      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnit.toString()).toBe(decimalString);
      expect(bigUnit.precision).toBe(precision);
    });

    test('should handle a decimal string with more precision than BigUnit\'s precision', () => {
      const decimalString = "123.4567"; // More precision than specified
      const bigUnit = BigUnit.fromDecimalString(decimalString, precision);

      expect(bigUnit).toBeInstanceOf(BigUnit);
      // The value should be truncated to match the specified precision
      expect(bigUnit.toString()).toBe("123.45");
      expect(bigUnit.precision).toBe(precision);
    });
  });

  describe('from method', () => {
    test('should convert number to BigUnit with correct precision', () => {
      const numberValue = 123.45;
      const bigUnitFromNumber = BigUnit.from(numberValue, precision);

      expect(bigUnitFromNumber).toBeInstanceOf(BigUnit);
      expect(bigUnitFromNumber.toNumber()).toBeCloseTo(numberValue);
      expect(bigUnitFromNumber.precision).toBe(precision);
    });

    test('should convert a decimal string to BigUnit with correct precision', () => {
      const decimalString = "123.45";
      const bigUnitFromDecimalString = BigUnit.from(decimalString, precision);

      expect(bigUnitFromDecimalString).toBeInstanceOf(BigUnit);
      expect(bigUnitFromDecimalString.toString()).toBe(decimalString);
      expect(bigUnitFromDecimalString.precision).toBe(precision);
    });

    test('should convert BigInt to BigUnit with correct precision', () => {
      const bigIntValue = 12345n;
      const bigUnitFromBigInt = BigUnit.from(bigIntValue, precision);

      expect(bigUnitFromBigInt).toBeInstanceOf(BigUnit);
      expect(bigUnitFromBigInt.value).toBe(bigIntValue);
      expect(bigUnitFromBigInt.precision).toBe(precision);
    });

    test('should convert BigUnit to BigUnit with correct precision', () => {
      const bigUnitValue = new BigUnit(12345n, 2);
      const bigUnitFromBigUnit = BigUnit.from(bigUnitValue, precision);

      expect(bigUnitFromBigUnit).toBeInstanceOf(BigUnit);
      expect(bigUnitFromBigUnit.value).toBe(bigUnitValue.value);
      expect(bigUnitFromBigUnit.precision).toBe(precision);
    });

    test('should throw error when precision is not provided and input is not a BigUnit', () => {
      const numberValue = 123.45;
      const fromNumberWithoutPrecision = () => BigUnit.from(numberValue);

      expect(fromNumberWithoutPrecision).toThrow(MissingPrecisionError);
    });

    test('should handle invalid input types', () => {
      const invalidInput = { notANumber: true };
      const fromInvalidInput = () => BigUnit.from(invalidInput as any, precision);

      expect(fromInvalidInput).toThrow(InvalidValueTypeError);
    });
  });

});
