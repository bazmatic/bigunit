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

    const namelessUnit = new BigUnit(value, precision);

    expect(namelessUnit).toBeInstanceOf(BigUnit);
    expect(namelessUnit.value).toBe(value);
    expect(namelessUnit.precision).toBe(precision);
    expect(namelessUnit.name).toBeUndefined();
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
  
  //TODO: Should we also have a test for when name isn't provided?
});

describe("BigUnit Class Static Factory Methods", () => {
  /*TODO: 
  All need to be tested with negative values

  I think we should also test
  ints
  decimals greater than 1
  decimals less than 1
  
  Inputs with greater precision than specified for the BigUnit

  Also should add tests for more levels of precision
  low precision input to high precision bigint e.g. BigUnit.from(1.123, 24);
  high precision input to high precision bigint e.g. BigUnit.from(1.123456789012345678901234, 24);
  */  
  const precision = 2;
  const highPrecision = 24;

  describe("fromBigInt method", () => {
    test("should convert BigInt to BigUnit with correct precision", () => {
      const bigIntValue1 = 12345n;
      const bigUnit1 = BigUnit.fromBigInt(bigIntValue1, precision);

      expect(bigUnit1).toBeInstanceOf(BigUnit);
      expect(bigUnit1.value).toBe(bigIntValue1);
      expect(bigUnit1.precision).toBe(precision);

      const bigIntValue2 = -12345n;
      const bigUnit2 = BigUnit.fromBigInt(bigIntValue2, precision);

      expect(bigUnit2).toBeInstanceOf(BigUnit);
      expect(bigUnit2.value).toBe(bigIntValue2);
      expect(bigUnit2.precision).toBe(precision);

      const bigIntValue3 = 12345n;
      const bigUnit3 = BigUnit.fromBigInt(bigIntValue3, highPrecision);

      expect(bigUnit3).toBeInstanceOf(BigUnit);
      expect(bigUnit3.value).toBe(bigIntValue3);
      expect(bigUnit3.precision).toBe(highPrecision);
    });
  });

  describe("fromNumber method", () => {
    test("should convert number to BigUnit with correct precision", () => {
      const numberValue1 = 123.45;
      const bigUnit1 = BigUnit.fromNumber(numberValue1, precision);

      expect(bigUnit1).toBeInstanceOf(BigUnit);
      expect(bigUnit1.toNumber()).toBeCloseTo(numberValue1);
      expect(bigUnit1.precision).toBe(precision);

      const numberValue2 = -123.45;
      const bigUnit2 = BigUnit.fromNumber(numberValue2, precision);

      expect(bigUnit2).toBeInstanceOf(BigUnit);
      expect(bigUnit2.toNumber()).toBeCloseTo(numberValue2);
      expect(bigUnit2.precision).toBe(precision);

      const numberValue3 = 123;
      const bigUnit3 = BigUnit.fromNumber(numberValue3, precision);

      expect(bigUnit3).toBeInstanceOf(BigUnit);
      expect(bigUnit3.toNumber()).toBeCloseTo(numberValue3);
      expect(bigUnit3.precision).toBe(precision);

      const numberValue4 = 0.12;
      const bigUnit4 = BigUnit.fromNumber(numberValue4, precision);

      expect(bigUnit4).toBeInstanceOf(BigUnit);
      expect(bigUnit4.toNumber()).toBeCloseTo(numberValue4);
      expect(bigUnit4.precision).toBe(precision);

      const numberValue5 = 123.456789;
      const bigUnit5 = BigUnit.fromNumber(numberValue5, precision);

      expect(bigUnit5).toBeInstanceOf(BigUnit);
      // Note numberValue5 exceeds precision, so it is truncated
      expect(bigUnit5.toNumber()).toBe(123.45);
      expect(bigUnit5.precision).toBe(precision);

      const numberValue6 = 123.45;
      const bigUnit6 = BigUnit.fromNumber(numberValue6, highPrecision);

      expect(bigUnit6).toBeInstanceOf(BigUnit);
      expect(bigUnit6.toNumber()).toBeCloseTo(numberValue6);
      expect(bigUnit6.precision).toBe(highPrecision);

      const numberValue7 = 1.123456789012345678901234;
      const bigUnit7 = BigUnit.fromNumber(numberValue7, highPrecision);

      expect(bigUnit7).toBeInstanceOf(BigUnit);
      expect(bigUnit7.toNumber()).toBeCloseTo(numberValue7);
      expect(bigUnit7.precision).toBe(highPrecision);
    });
  });

  describe("fromDecimalString method", () => {
    test("should convert a decimal string to BigUnit with correct precision", () => {
      const decimalString1 = "123.45";
      const bigUnit1 = BigUnit.fromDecimalString(decimalString1, precision);

      expect(bigUnit1).toBeInstanceOf(BigUnit);
      expect(bigUnit1.toString()).toBe(decimalString1);
      expect(bigUnit1.precision).toBe(precision);

      const decimalString2 = "-123.45";
      const bigUnit2 = BigUnit.fromDecimalString(decimalString2, precision);

      expect(bigUnit2).toBeInstanceOf(BigUnit);
      expect(bigUnit2.toString()).toBe(decimalString2);
      expect(bigUnit2.precision).toBe(precision);

      const decimalString3 = "123";
      const bigUnit3 = BigUnit.fromDecimalString(decimalString3, precision);

      expect(bigUnit3).toBeInstanceOf(BigUnit);
      expect(bigUnit3.toString()).toBe("123.00");
      expect(bigUnit3.precision).toBe(precision);

      const decimalString4 = "0.12";
      const bigUnit4 = BigUnit.fromDecimalString(decimalString4, precision);

      expect(bigUnit4).toBeInstanceOf(BigUnit);
      expect(bigUnit4.toString()).toBe(decimalString4);
      expect(bigUnit4.precision).toBe(precision);

      const decimalString5 = "123.456789";
      const bigUnit5 = BigUnit.fromDecimalString(decimalString5, precision);

      expect(bigUnit5).toBeInstanceOf(BigUnit);
      // Note decimalString5 exceeds precision, so it is truncated
      expect(bigUnit5.toString()).toBe("123.45");
      expect(bigUnit5.precision).toBe(precision);

      const decimalString6 = "123.45";
      const bigUnit6 = BigUnit.fromDecimalString(decimalString6, highPrecision);

      expect(bigUnit6).toBeInstanceOf(BigUnit);
      // Note the high precision
      expect(bigUnit6.toString()).toBe("123.450000000000000000000000");
      expect(bigUnit6.precision).toBe(highPrecision);

      const decimalString7 = "1.123456789012345678901234";
      const bigUnit7 = BigUnit.fromDecimalString(decimalString7, highPrecision);

      expect(bigUnit7).toBeInstanceOf(BigUnit);
      expect(bigUnit7.toString()).toBe(decimalString7);
      expect(bigUnit7.precision).toBe(highPrecision);

      const decimalString8 = "00012.123";
      const bigUnit8 = BigUnit.fromDecimalString(decimalString8, precision);

      expect(bigUnit8).toBeInstanceOf(BigUnit);
      expect(bigUnit8.toString()).toBe("12.12");
      expect(bigUnit8.precision).toBe(precision);
    });
    //TODO test for leading zeros in integer part for fromDecimalString() e.g. 00012.123

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
      const precision = 4;

      const decimalString1 = "100.";
      const expectedValue1 = BigInt(100 * 10 ** precision); // Expected: 100 * 10^4

      const bigUnit1 = BigUnit.fromDecimalString(decimalString1, precision);

      expect(bigUnit1).toBeInstanceOf(BigUnit);
      expect(bigUnit1.value).toBe(expectedValue1);
      expect(bigUnit1.precision).toBe(precision);

      const decimalString2 = ".1234";
      const expectedValue2 = BigInt(1234); // Expected: 1234

      const bigUnit2 = BigUnit.fromDecimalString(decimalString2, precision);

      expect(bigUnit2).toBeInstanceOf(BigUnit);
      expect(bigUnit2.value).toBe(expectedValue2);
      expect(bigUnit2.precision).toBe(precision);
    });
    //TODO: add test for decimal strings without an integer part e.g. ".1234"

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

    /*TODO missing tests for:
      fromValueString()
    */

    describe("fromValueString method", () => {
      test("should create a BigUnit instance with the correct value and precision", () => {
        const valueString = "10000";
        const precision = 2;
        const name = "Test";
        const result = BigUnit.fromValueString(valueString, precision, name);
        const expectedValue = 10000n;

        expect(result.value).toBe(expectedValue);
        expect(result.precision).toBe(precision);
        expect(result.name).toBe(name);
      });

      test("should create a BigUnit instance with the default name if name is not provided", () => {
        const valueString = "10000";
        const precision = 2;
        const result = BigUnit.fromValueString(valueString, precision);
        const expectedValue = 10000n;

        expect(result.value).toBe(expectedValue);
        expect(result.precision).toBe(precision);
        expect(result.name).toBeUndefined();
      });
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
        precision: 18,
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
