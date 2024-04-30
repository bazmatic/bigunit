import {
  DivisionByZeroError,
  InvalidFractionError,
  InvalidPrecisionError,
  InvalidValueTypeError,
  MissingPrecisionError,
} from "./errors";
import { bigintAbs, numberToDecimalString } from "./utils";

export * as utils from "./utils";

export enum RoundingMethod {
  Nearest = "Nearest",
  Floor = "Floor",
  Ceil = "Ceil",
  None = "None", // Truncation
}

export interface IBigUnitObject {
  value: string;
  precision: number;
  name?: string;
}

export interface IBigUnitDTO extends IBigUnitObject {
  value: string;
  precision: number;
  decimalValue: string;
  name?: string;
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

  public makeOther(other: BigUnitish, otherPrecision?: number): BigUnit {
    if (typeof other === "bigint" && otherPrecision === undefined) {
      throw new MissingPrecisionError();
    }
    const otherUnit =
      other instanceof BigUnit
        ? other
        : BigUnit.from(other, otherPrecision ?? this.precision);
    return otherUnit;
  }

  /**
   * @description Add the other value to this value
   * @param other
   * @returns BigUnit with the result value in the highest precision
   */
  public add(other: BigUnitish, otherPrecision?: number): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = this.makeOther(other, otherPrecision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Add the values
    return new BigUnit(
      thisUnitAtHighestPrecision.value + otherUnitAtHighestPrecision.value,
      thisUnitAtHighestPrecision.precision,
    );
  }

  /**
   * @description Subtract the other value from this value
   * @param other
   * @returns new BigUnit with the result value in the highest precision
   */
  public sub(other: BigUnitish, otherPrecision?: number): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = this.makeOther(other, otherPrecision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Subtract the values
    return new BigUnit(
      thisUnitAtHighestPrecision.value - otherUnitAtHighestPrecision.value,
      thisUnitAtHighestPrecision.precision,
    );
  }

  /**
   * @description Multiply the other value by this value
   * @param other
   * @returns new BigUnit with the result value in the highest precision
   */
  public mul(other: BigUnitish, otherPrecision?: number): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = this.makeOther(other, otherPrecision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Multiply the values and then adjust the result to account for the precision
    const resultValue =
      (thisUnitAtHighestPrecision.value * otherUnitAtHighestPrecision.value) /
      10n ** BigInt(thisUnitAtHighestPrecision.precision);

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
    const otherUnit = this.makeOther(other);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    // Perform division operation
    if (otherUnitAtHighestPrecision.isZero()) {
      throw new DivisionByZeroError();
    }
    const scaleFactor = 10n ** BigInt(thisUnitAtHighestPrecision.precision);
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
    const otherUnit = this.makeOther(other);

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
   * @description Remove previously added percentage from this value.
   * This is sometimes referred to as "backing out" a percentage.
   * @param percent
   * @returns new BigUnit with the result value in the same precision
   */
  public percentBackout(percent: number): BigUnit {
    return this.div(BigUnit.from(1).percent(percent));
  }

  /**
   * @description Equality check
   * @param other
   * @returns True if the values are equal, false otherwise
   */
  public eq(other: BigUnitish, otherPrecision?: number): boolean {
    const otherUnit = this.makeOther(other, otherPrecision);
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);
    return (
      thisUnitAtHighestPrecision.value === otherUnitAtHighestPrecision.value
    );
  }

  /**
   * @description Greater than check
   * @param other
   * @returns True if the other value is greater than this value, false otherwise
   */
  public gt(other: BigUnitish, otherPrecision?: number): boolean {
    const otherUnit = this.makeOther(other, otherPrecision);
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    return thisUnitAtHighestPrecision.value > otherUnitAtHighestPrecision.value;
  }

  /**
   * @description Less than check
   * @param other
   * @returns True if the other value is less than this value, false otherwise
   */
  public lt(other: BigUnitish, otherPrecision?: number): boolean {
    const otherUnit = this.makeOther(other, otherPrecision);
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    return thisUnitAtHighestPrecision.value < otherUnitAtHighestPrecision.value;
  }

  /**
   * @description Greater than or equal to check
   * @param other
   * @returns True if the other value is greater than or equal to this value, false otherwise
   */
  public gte(other: BigUnitish, otherPrecision?: number): boolean {
    const otherUnit = this.makeOther(other, otherPrecision);
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    return (
      thisUnitAtHighestPrecision.value >= otherUnitAtHighestPrecision.value
    );
  }

  /**
   * @description Less than or equal to check
   * @param other
   * @returns True if the other value is less than or equal to this value, false otherwise
   */
  public lte(other: BigUnitish, otherPrecision?: number): boolean {
    const otherUnit = this.makeOther(other, otherPrecision);
    const [thisUnitAtHighestPrecision, otherUnitAtHighestPrecision] =
      BigUnit.asHighestPrecision(this, otherUnit);

    return (
      thisUnitAtHighestPrecision.value <= otherUnitAtHighestPrecision.value
    );
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
   * @description Output a zero value BigUnit
   * @param precision The precision of the zero value, default to 0
   * @returns
   */
  public static zero(precision?: number): BigUnit {
    return BigUnit.from(0, precision ?? 0);
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
  public asPrecision(
    precision: number,
    roundingMethod: RoundingMethod = RoundingMethod.None,
  ): BigUnit {
    // Ensure precision is an integer
    BigUnit.validatePrecision(precision);

    const scalingFactor = 10n ** BigInt(Math.abs(this.precision - precision));
    let newValue: bigint;

    if (this.precision < precision) {
      newValue = this.value * scalingFactor; // Scaling up, no rounding needed
    } else if (this.precision > precision) {
      const downScaleFactor = 10n ** BigInt(this.precision - precision);
      switch (roundingMethod) {
        case RoundingMethod.Nearest:
          const halfDownScale = downScaleFactor / 2n;
          newValue = (this.value + halfDownScale) / downScaleFactor;
          break;
        case RoundingMethod.Floor:
          newValue = this.value / downScaleFactor; // Equivalent to Math.floor for positive numbers
          if (this.value < 0n && this.value % downScaleFactor !== 0n) {
            newValue -= 1n; // Adjust for negative numbers
          }
          break;
        case RoundingMethod.Ceil:
          newValue = this.value / downScaleFactor; // Start with truncation
          if (this.value > 0n && this.value % downScaleFactor !== 0n) {
            newValue += 1n; // Adjust for positive numbers
          }
          break;
        case RoundingMethod.None:
          newValue = this.value / downScaleFactor; // Simple truncation
          break;
        default:
          throw new Error("Invalid rounding method");
      }
    } else {
      newValue = this.value; // No change in precision, no rounding needed
    }

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
    const result = `${
      integerPart === "" ? "0" : integerPart
    }.${fractionalPart}`;
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
    // TODO: Check behaviour when using high precision bigunits e.g. precision of 23
    let scaledValue =
      bigintAbs(this.value) *
      BigInt(10n ** BigInt(Math.max(targetPrecision - this.precision, 0)));

    // Apply rounding when scaling down
    if (this.precision > targetPrecision) {
      // TODO: Check behaviour when using high precision bigunits e.g. precision of 23
      const divisor = BigInt(10 ** (this.precision - targetPrecision));
      const halfDivisor = divisor / BigInt(2);
      const remainder = scaledValue % divisor;
      scaledValue =
        scaledValue / divisor +
        (remainder >= halfDivisor ? BigInt(1) : BigInt(0));
    }

    let stringValue = scaledValue.toString();

    if (targetPrecision > 0) {
      // Insert decimal point for non-zero target precision
      while (stringValue.length <= targetPrecision) {
        stringValue = "0" + stringValue; // Pad with leading zeros
      }
      const insertPosition = stringValue.length - targetPrecision;
      stringValue =
        stringValue.substring(0, insertPosition) +
        "." +
        stringValue.substring(insertPosition);
    }

    // if < 0 prepend '-'
    if (this.value < 0n) {
      stringValue = "-" + stringValue;
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
   * @description Convert to a DTO representation of the unit
   * @returns DTO representation of the BigUnit
   * @note Same as toObject()
   * @example
   * {
   *    value: "1000000000000000000",
   *    precision: 18,
   *    decimalValue: "1.000000000000000000",
   *    name: "ETH"
   * }
   *
   */
  public toDTO(): IBigUnitDTO {
    return {
      value: this.toValueString(),
      precision: this.precision,
      name: this.name,
      decimalValue: this.toString(),
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
    return new BigUnit(BigInt(obj.value), obj.precision, obj?.name);
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

    // If the integer part is negative, subtract the fractional part from the integer part otherwise it will incorrectly be positive
    // NOTE: We use string comparison here rather then something like "integerPartBigInt < 0" because the integerPart for negative greater then "-1.00" will be "-0" (eg -0.123)
    // which will miss the negative check
    if (integerPart[0] === "-") {
      // Combine the integer and fractional parts
      let combinedValueBigInt =
        integerPartBigInt * precisionFactor - fractionalPartBigInt;

      // Return the BigUnit
      return new BigUnit(combinedValueBigInt, precision, name);
    }

    // Combine the integer and fractional parts
    let combinedValueBigInt =
      integerPartBigInt * precisionFactor + fractionalPartBigInt;

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

  public zero(): BigUnit {
    return BigUnit.zero(this.precision);
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
