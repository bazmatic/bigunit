import {
  DivisionByZeroError,
  InvalidFractionError,
  InvalidPrecisionError,
  InvalidValueTypeError,
  MissingPrecisionError,
} from "./errors";
import { bigintAbs, bigintCloseTo, numberToDecimalString } from "./utils";

export interface IBigUnitObject {
  value: string;
  precision: number;
  name: string;
}

export class BigUnit {
  constructor(
    public value: bigint,
    public precision: number,
    public name?: string,
  ) {
    // throw if precision is not a positive integer
    BigUnit.validatePrecision(precision);
  }

  public static validatePrecision(precision: number): void {
    if ((precision !== undefined && precision % 1 !== 0) || precision < 0) {
      throw new InvalidPrecisionError(precision);
    }
  }

  /**
   * @description Add the other value to this value
   * @param other
   * @returns BigUnit with the result value in the highest precision
   */
  public add(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit =
      other instanceof BigUnit ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Add the values
    return new BigUnit(
      thisUnitAtHighestPrecision.value + otherUnitAtHighestPrecision.value,
      this.precision,
    );
  }

  /**
   * @description Subtract the other value from this value
   * @param other
   * @returns new BigUnit with the result value in the highest precision
   */
  public sub(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit =
      other instanceof BigUnit ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Subtract the values
    return new BigUnit(
      thisUnitAtHighestPrecision.value - otherUnitAtHighestPrecision.value,
      this.precision,
    );
  }

  /**
   * @description Multiply the other value by this value
   * @param other
   * @returns new BigUnit with the result value in the highest precision
   */
  public mul(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit =
      other instanceof BigUnit ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Multiply the values and then adjust the result to account for the precision
    const resultValue =
      (thisUnitAtHighestPrecision.value * otherUnitAtHighestPrecision.value) /
      BigInt(10 ** thisUnitAtHighestPrecision.precision);

    // Return a new BigUnit with the result value and the highest precision
    return new BigUnit(resultValue, thisUnitAtHighestPrecision.precision);
  }

  /**
   * @description Divide this value by the other value
   * @param other
   * @returns new BigUnit with the result value in the highest precision
   */
  public div(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit =
      other instanceof BigUnit ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    const highestPrecision = thisUnitAtHighestPrecision.precision;

    // Perform division operation
    if (otherUnitAtHighestPrecision.isZero()) {
      throw new DivisionByZeroError();
    }
    const scaleFactor = BigInt(10 ** thisUnitAtHighestPrecision.precision);
    const resultValue =
      (thisUnitAtHighestPrecision.value * scaleFactor) /
      otherUnitAtHighestPrecision.value;

    // Return a new BigUnit instance with the division result and highest precision
    return BigUnit.from(resultValue, thisUnitAtHighestPrecision.precision);
  }

  /**
   * @description Perform modulo operation on this value by the other value
   * @param other
   * @returns new BigUnit with the result value in the highest precision
   */
  public mod(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit =
      other instanceof BigUnit ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Perform modulo operation
    if (otherUnitAtHighestPrecision.isZero()) {
      throw new DivisionByZeroError();
    }
    const resultValue =
      thisUnitAtHighestPrecision.value % otherUnitAtHighestPrecision.value;

    // Return a new BigUnit instance with the modulo result and highest precision
    return BigUnit.from(resultValue, thisUnitAtHighestPrecision.precision);
  }

  /**
   * @description Return the absolute value
   * @returns new BigUnit with the result value in the same precision
   */
  public abs(): BigUnit {
    return new BigUnit(
      this.value < 0n ? -this.value : this.value,
      this.precision,
      this.name,
    );
  }

  /**
   * @description Negate the value
   * @returns new BigUnit with the result value in the same precision
   */
  public neg(): BigUnit {
    return new BigUnit(-this.value, this.precision, this.name);
  }

  /**
   * @description Calculate the fraction of this value
   * @param fraction
   * @returns new BigUnit with the result value in the same precision
   */
  public fraction(numerator: number, denominator: number): BigUnit {
    if (isNaN(numerator) || isNaN(denominator)) {
      throw new InvalidFractionError(
        "Numerator and denominator must be valid numbers",
      );
    }

    // Check for division by zero
    if (denominator === 0) {
      throw new DivisionByZeroError();
    }

    const bigUnitNumerator = BigUnit.from(numerator, this.precision);
    const bigUnitDenominator = BigUnit.from(denominator, this.precision);
    const resultValue = this.mul(bigUnitNumerator).div(bigUnitDenominator);
    // Return a new BigUnit with the result value and the same precision
    return resultValue;
  }

  /**
   * @description Calculate the percentage of this value
   * @param percent
   * @returns new BigUnit with the result value in the same precision
   */
  public percent(percent: number): BigUnit {
    return this.fraction(percent, 100);
  }

  /**
   * @description Equality check
   * @param other
   * @returns True if the values are equal, false otherwise
   */
  public eq(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value === other.asPrecision(this.precision).value;
    }
    return this.value === BigUnit.from(other, this.precision).value;
  }

  /**
   * @description Greater than check
   * @param other
   * @returns True if the other value is greater than this value, false otherwise
   */
  public gt(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value > other.asPrecision(this.precision).value;
    }
    return this.value > BigUnit.from(other, this.precision).value;
  }

  /**
   * @description Less than check
   * @param other
   * @returns True if the other value is less than this value, false otherwise
   */
  public lt(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value < other.asPrecision(this.precision).value;
    }
    return this.value < BigUnit.from(other, this.precision).value;
  }

  /**
   * @description Greater than or equal to check
   * @param other
   * @returns True if the other value is greater than or equal to this value, false otherwise
   */
  public gte(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value >= other.asPrecision(this.precision).value;
    }
    return this.value >= BigUnit.from(other, this.precision).value;
  }

  /**
   * @description Less than or equal to check
   * @param other
   * @returns True if the other value is less than or equal to this value, false otherwise
   */
  public lte(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value <= other.asPrecision(this.precision).value;
    }
    return this.value <= BigUnit.from(other, this.precision).value;
  }

  /**
   * @description Check if the value is zero
   * @returns True if the value is zero, false otherwise
   */
  public isZero(): boolean {
    return this.value === 0n;
  }

  /**
   * @description Check if the value is positive
   * @returns True if the value is positive, false otherwise
   */
  public isPositive(): boolean {
    return this.value > 0n;
  }

  /**
   * @description Check if the value is negative
   * @returns True if the value is negative, false otherwise
   */
  public isNegative(): boolean {
    return this.value < 0n;
  }

  /**
   * @description Return the maximum of the two values
   * @returns BigUnit with the maximum value
   */
  public static max(unit1: BigUnit, unit2: BigUnit): BigUnit {
    return unit1.gt(unit2) ? unit1 : unit2;
  }

  /**
   * @description Return the minimum of the two values
   * @returns BigUnit with the minimum value
   */
  public static min(unit1: BigUnit, unit2: BigUnit): BigUnit {
    return unit1.lt(unit2) ? unit1 : unit2;
  }

  /**
   * @description Determine the highest precision of the two units and convert both units to the highest precision, returning them in an array
   * @param unit1
   * @param unit2
   * @returns [BigUnit, BigUnit]
   */
  public static asHighestPrecision(
    unit1: BigUnit,
    unit2: BigUnit,
  ): [BigUnit, BigUnit] {
    // Determine the highest precision of the two units and convert both units to the highest precision
    const highestPrecision = Math.max(unit1.precision, unit2.precision);
    const unit1AtHighestPrecision = unit1.asPrecision(highestPrecision);
    const unit2AtHighestPrecision = unit2.asPrecision(highestPrecision);

    return [unit1AtHighestPrecision, unit2AtHighestPrecision];
  }

  // Express the value as a BigUnit with the given precision
  /**
   * @description If the new precision is greater than the current precision, the value needs to be scaled up,
   * which involves multiplying by a factor of 10 raised to the power of the difference in precision.
   * Conversely, if the new precision is less, the value should be scaled down, and we divide by the scaling factor.
   * @param precision
   * @returns
   */
  public asPrecision(precision: number): BigUnit {
    // Check if precision is an integer
    if (precision % 1 !== 0) {
      throw new InvalidPrecisionError(precision);
    }

    // Calculate the scaling factor as a bigint
    const scalingFactor = 10n ** BigInt(Math.abs(this.precision - precision));

    // Scale the value up or down based on the new precision
    const newValue =
      this.precision < precision
        ? this.value * scalingFactor
        : this.value / scalingFactor;

    // Return a new BigUnit with the scaled value and new precision
    return new BigUnit(newValue, precision, this.name);
  }

  /**
   * @description Express the value as a BigUnit with the precision of the other BigUnit
   * @param other
   * @returns
   */
  public asOtherPrecision(other: BigUnit): BigUnit {
    // Express the value as a BigUnit with the given precision
    return this.asPrecision(other.precision);
  }

  /**
   * @description Convert to a number representation
   * @returns number representation of the Unit
   */
  // TODO: Review
  public toNumber(): number {
    // Determine the maximum safe integer in JavaScript
    const maxSafeInteger = Number.MAX_SAFE_INTEGER;

    // If the value is within the safe range, convert directly
    if (this.value <= maxSafeInteger) {
      return Number(this.value) / 10 ** this.precision;
    }

    // If the value is larger than the safe range, truncate the bigint before converting
    const valueString = this.value.toString();
    const safeDigits =
      valueString.length -
      (valueString.length - maxSafeInteger.toString().length);
    const truncatedValueString = valueString.slice(0, safeDigits);
    const truncatedValueBigInt = BigInt(truncatedValueString);

    // Convert the truncated bigint to a number and then divide by the precision
    // Adjust the precision accordingly since we truncated the bigint
    return (
      Number(truncatedValueBigInt) /
      10 ** (this.precision - (valueString.length - safeDigits))
    );
  }

  /**
   * @dev Convert to a string representation of the unit, using fixed-point notation.
   */
  public toString(): string {
    let valueString = this.value.toString();
    let isNegative = false;

    // Check if the value is negative and handle accordingly
    if (this.value < 0) {
      isNegative = true;
      valueString = valueString.substring(1); // Remove the negative sign for processing
    }

    // If the precision is zero, return the value as a string as there are no decimals
    if (this.precision === 0) {
      return isNegative ? `-${valueString}` : valueString;
    }

    // Calculate the index of the decimal point
    const length = valueString.length;

    // If the length is less than the precision, pad with zeros
    if (length < this.precision) {
      const padding = "0".repeat(this.precision - length);
      return isNegative 
        ? `-0.${padding}${valueString}` 
        : `0.${padding}${valueString}`;
    }

    // If the length is greater than the precision, slice the string
    const decimalIndex = length - this.precision;
    const integerPart = valueString.slice(0, decimalIndex);
    const fractionalPart = valueString.slice(decimalIndex);

    // Construct the final string
    const result = `${integerPart === "" ? "0" : integerPart}.${fractionalPart}`;
    return isNegative ? `-${result}` : result;
  }

  public toBigInt(): bigint {
    return this.value;
  }

  /**
   * @description Format the value as a string with the given precision (Note: this uses standard rounding and is overflow safe)
   * @param precision - the number of digits to appear after the decimal point
   * @returns string representation of the unit value
   */
  public format(targetPrecision: number): string {
    BigUnit.validatePrecision(targetPrecision);
    // if < 0 absolute value
    let scaledValue = bigintAbs(this.value) * BigInt(10n ** BigInt((Math.max(targetPrecision - this.precision, 0))));

    // Apply rounding when scaling down
    if (this.precision > targetPrecision) {
        const divisor = BigInt(10 ** (this.precision - targetPrecision));
        const halfDivisor = divisor / BigInt(2);
        const remainder = scaledValue % divisor;
        scaledValue = (scaledValue / divisor) + (remainder >= halfDivisor ? BigInt(1) : BigInt(0));
    }

    let stringValue = scaledValue.toString();

    if (targetPrecision > 0) {
      // Insert decimal point for non-zero target precision
      while (stringValue.length <= targetPrecision) {
          stringValue = '0' + stringValue; // Pad with leading zeros
      }
      const insertPosition = stringValue.length - targetPrecision;
      stringValue = stringValue.substring(0, insertPosition) + '.' + stringValue.substring(insertPosition);
  }

    // if < 0 prepend '-'
    if (this.value < 0n) {
      stringValue = '-' + stringValue;
    }

    return stringValue;
  }

  /**
   * @description Convert to a JSON representation of the unit
   * @returns JSON representation of the BigUnit
   */
  public toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  /**
   * @description Convert to an object representation of the unit
   * @returns object representation of the BigUnit
   * @example
   * {
   *    value: "1000000000000000000",
   *    precision: 18,
   *    name: "ETH"
   * }
   *
   */
  public toObject(): IBigUnitObject {
    return {
      value: this.toValueString(),
      precision: this.precision,
      name: this.name,
    };
  }

  /**
   * @description Convert to the internal string representation of the unit value
   * @returns bigint string
   */
  public toValueString(): string {
    return this.value.toString();
  }

  //=== Static factory methods

  /**
   * @dev Convert a bigint to a BigUnit
   * @param bigintValue
   */
  public static fromBigInt(
    bigintValue: bigint,
    precision: number,
    name?: string,
  ): BigUnit {
    return new BigUnit(bigintValue, precision, name);
  }

  /**
   * @dev Convert a number to a BigUnit
   * @param numberValue
   */
  public static fromNumber(
    numberValue: number,
    precision: number,
    name?: string,
  ): BigUnit {
    // Convert the number to a string to avoid precision loss
    let numberString = numberToDecimalString(numberValue);

    // Check if there's a decimal point
    let [integerPart, fractionalPart = ""] = numberString.split(".");

    // Pad or trim the fractional part to match the precision
    fractionalPart = fractionalPart.padEnd(precision, "0").slice(0, precision);

    // Reconstruct the number string with the adjusted fractional part
    numberString = integerPart + (fractionalPart ? "." + fractionalPart : "");

    // Convert the string to a bigint representation
    const bigIntValue = BigInt(numberString.replace(".", ""));

    // Return a new BigUnit with the bigint value and specified precision
    return new BigUnit(bigIntValue, precision, name);
  }

  /**
   * @description Convert a bigint string to a BigUnit
   * @param valueString
   * @param precision
   * @param name
   * @returns
   */
  public static fromValueString(
    valueString: string,
    precision: number,
    name?: string,
  ): BigUnit {
    return new BigUnit(BigInt(valueString), precision, name);
  }

  /**
   * @dev Convert a plain object to a BigUnit
   * @param obj
   */
  public static fromObject(obj: IBigUnitObject): BigUnit {
    return new BigUnit(BigInt(obj.value), obj.precision, obj.name);
  }

  /**
   * @dev Convert a decimal string to a BigUnit, eg. "1.23456"
   * @param decimalStringValue
   */
  public static fromDecimalString(
    decimalStringValue: string,
    precision: number,
    name?: string,
  ): BigUnit {
    // Split the string into integer and fractional parts
    const [integerPart, fractionalPart] = decimalStringValue.split(".");

    // Convert the integer part to a bigint
    const integerPartBigInt = BigInt(integerPart);

    // Calculate the precision factor
    const precisionFactor = 10n ** BigInt(precision);

    // If there is no fractional part, return the integer part
    if (!fractionalPart) {
      return new BigUnit(integerPartBigInt * precisionFactor, precision, name);
    }

    // Prepare the fractional part string by padding it with zeros to match the precision length
    const paddedFractionalPart = fractionalPart
      .padEnd(precision, "0")
      .slice(0, precision);

    // Convert the padded fractional part to a bigint
    const fractionalPartBigInt = BigInt(paddedFractionalPart);

    // Combine the integer and fractional parts
    let combinedValueBigInt =
      integerPartBigInt * precisionFactor + fractionalPartBigInt;

    // If the integer part is negative, convert the fractional part to a negative number otherwise it will incorrectly be positive
    if (integerPart[0] === "-") {
      combinedValueBigInt = -combinedValueBigInt;
    }

    // Return the BigUnit
    return new BigUnit(combinedValueBigInt, precision, name);
  }

  /**
   * @description Convert a value of various types to a BigUnit.
   * @param value - The value to convert to a BigUnit.
   * @param precision - The precision to use for the BigUnit. Unless the input value is BigUnit, a precision must be provided.
   * If the input is a BigUnit, the precision is optional and if provided, will cause the returned BigUnit to be converted to the given precision.
   * @param name - The name of the BigUnit
   * @returns
   */
  public static from(
    value: BigUnitish,
    precision?: number,
    name?: string,
  ): BigUnit {
    // throw if precision is not a positive integer
    this.validatePrecision(precision);
    // If the value is already a BigUnit, return it. If precision is provided, convert it to the given precision
    if (value instanceof BigUnit) {
      if (precision === undefined || precision === value.precision) {
        return value;
      }
      return value.asPrecision(precision);
    }

    // The other constructor methods require a precision
    if (precision === undefined) {
      throw new MissingPrecisionError();
    }

    if (typeof value === "number") {
      return BigUnit.fromNumber(value, precision, name);
    } else if (typeof value === "string") {
      return BigUnit.fromDecimalString(value, precision, name);
    } else if (typeof value === "bigint") {
      return BigUnit.fromBigInt(value, precision, name);
    } else {
      throw new InvalidValueTypeError(value);
    }
  }
}

/**
 * @description BigUnitFactory is a convenience class for creating BigUnit instances with the same name and precision.
 */
export class BigUnitFactory {
  constructor(
    public precision: number,
    public name?: string,
  ) {
    // throw if precision is not a positive integer
    BigUnit.validatePrecision(precision);
  }

  public from(value: BigUnitish): BigUnit {
    return BigUnit.from(value, this.precision, this.name);
  }

  public fromBigInt(bigintValue: bigint): BigUnit {
    return BigUnit.fromBigInt(bigintValue, this.precision, this.name);
  }

  public fromValueString(valueString: string): BigUnit {
    return BigUnit.fromValueString(valueString, this.precision, this.name);
  }

  public fromNumber(numberValue: number): BigUnit {
    return BigUnit.fromNumber(numberValue, this.precision, this.name);
  }

  public fromDecimalString(decimalStringValue: string): BigUnit {
    return BigUnit.fromDecimalString(
      decimalStringValue,
      this.precision,
      this.name,
    );
  }
}

export type BigUnitish = number | string | bigint | BigUnit;
