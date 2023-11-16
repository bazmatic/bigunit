// Errors
export class BigUnitError extends Error {
  constructor(
    public message: string,
    public cause?: string,
    public data?: any,
  ) {
    super(message);
    this.name = BigUnitError.name;
  }
}

export class DifferentPrecisionError extends BigUnitError {
  constructor(operation: string, precisionA: number, precisionB: number) {
    super(
      `Cannot perform ${operation} operation on two units of different precision`,
      `${precisionA}, ${precisionB}`,
    );
  }
}

export class InvalidValueTypeError extends BigUnitError {
  constructor(value: unknown) {
    super(`Invalid value type: ${typeof value}`);
  }
}

export class MissingPrecisionError extends BigUnitError {
  constructor() {
    super("Missing precision");
  }
}

export class InvalidPrecisionError extends BigUnitError {
  constructor(precision: number) {
    super(`Invalid precision: ${precision}`);
  }
}

export class DivisionByZeroError extends BigUnitError {
  constructor() {
    super("Division by zero");
  }
}

export class InvalidFractionError extends BigUnitError {
  constructor(message: string) {
    super(message);
  }
}

export class BigUnit {
  constructor(
    public value: bigint,
    public precision: number,
    public name: string = "",
  ) {
    // throw if precision is not an integer
    if (precision % 1 !== 0) {
      throw new InvalidPrecisionError(precision);
    }
  }

  public add(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = (other instanceof BigUnit) ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [ thisUnitAtHighestPrecision, otherUnitAtHighestPrecision ] = BigUnit.asLargestPrecision(this, otherUnit);
  
    // Add the values
    return new BigUnit(thisUnitAtHighestPrecision.value + otherUnitAtHighestPrecision.value, this.precision);
  }

  public sub(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = (other instanceof BigUnit) ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [ thisUnitAtHighestPrecision, otherUnitAtHighestPrecision ] = BigUnit.asLargestPrecision(this, otherUnit);

    // Subtract the values
    return new BigUnit(thisUnitAtHighestPrecision.value - otherUnitAtHighestPrecision.value, this.precision);
  }

  public mul(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = (other instanceof BigUnit) ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [ thisUnitAtHighestPrecision, otherUnitAtHighestPrecision ] = BigUnit.asLargestPrecision(this, otherUnit);
  
    // Multiply the values and then adjust the result to account for the precision
    const resultValue = (thisUnitAtHighestPrecision.value * otherUnitAtHighestPrecision.value) / BigInt(10 ** thisUnitAtHighestPrecision.precision);
  
    // Return a new BigUnit with the result value and the highest precision
    return new BigUnit(resultValue, thisUnitAtHighestPrecision.precision);
  } 

  public div(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = (other instanceof BigUnit) ? other : BigUnit.from(other, this.precision);
  
    // Determine the highest precision of the two units and convert both units to the highest precision
    const [ thisUnitAtHighestPrecision, otherUnitAtHighestPrecision ] = BigUnit.asLargestPrecision(this, otherUnit);
  
    // Perform division operation
    if (otherUnitAtHighestPrecision.isZero()) {
      throw new DivisionByZeroError();
    }
    const resultValue = thisUnitAtHighestPrecision.value / otherUnitAtHighestPrecision.value;
  
    // Return a new BigUnit instance with the division result and highest precision
    return BigUnit.from(resultValue, thisUnitAtHighestPrecision.precision);
  }
  
  public mod(other: BigUnitish): BigUnit {
    // Ensure the other value is a BigUnit
    const otherUnit = (other instanceof BigUnit) ? other : BigUnit.from(other, this.precision);

    // Determine the highest precision of the two units and convert both units to the highest precision
    const [ thisUnitAtHighestPrecision, otherUnitAtHighestPrecision ] = BigUnit.asLargestPrecision(this, otherUnit);
  
    // Perform modulo operation
    if (otherUnitAtHighestPrecision.isZero()){
      throw new DivisionByZeroError();
    }
    const resultValue = thisUnitAtHighestPrecision.value % otherUnitAtHighestPrecision.value;
  
    // Return a new BigUnit instance with the modulo result and highest precision
    return BigUnit.from(resultValue, thisUnitAtHighestPrecision.precision);
  }

  public fraction(numerator: number, denominator: number): BigUnit {
    if (isNaN(numerator) || isNaN(denominator)) {
      throw new InvalidFractionError("Numerator and denominator must be valid numbers");
    }

    // Check for division by zero
    if (denominator === 0) {
      throw new DivisionByZeroError();
    }

    // Calculate the fraction of the value
    // The result should be multiplied by the power of 10 of the precision, we don't bother scaling the denominator
    const bigUnitNumerator = new BigUnit(BigInt(numerator), this.precision);
    const resultValue =
      (this.value * bigUnitNumerator.value) / BigInt(denominator);

    // Return a new BigUnit with the result value and the same precision
    return new BigUnit(resultValue, this.precision);
  }

  public percent(percent: number): BigUnit {
    return this.fraction(percent, 100);
  }

  public static asLargestPrecision(unit1: BigUnit, unit2: BigUnit): [BigUnit, BigUnit] {
    // Determine the highest precision of the two units and convert both units to the highest precision
    const highestPrecision = Math.max(unit1.precision, unit2.precision);
    const unit1AtHighestPrecision = unit1.asPrecision(highestPrecision);
    const unit2AtHighestPrecision = unit2.asPrecision(highestPrecision);

    return [unit1AtHighestPrecision, unit2AtHighestPrecision];
  }

  public eq(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value == other.value;
    }
    return this.value == BigUnit.from(other, this.precision).value;
  }

  public gt(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value > other.asPrecision(this.precision).value;
    }
    return this.value > BigUnit.from(other, this.precision).value;
  }

  public lt(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value < other.asPrecision(this.precision).value;
    }
    return this.value < BigUnit.from(other, this.precision).value;
  }

  public gte(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value >= other.asPrecision(this.precision).value;
    }
    return this.value >= BigUnit.from(other, this.precision).value;
  }

  public lte(other: BigUnitish): boolean {
    if (other instanceof BigUnit) {
      return this.value <= other.asPrecision(this.precision).value;
    }
    return this.value <= BigUnit.from(other, this.precision).value;
  }

  public isZero(): boolean {
    return this.value === 0n;
  }

  public isPositive(): boolean {
    return this.value > 0n;
  }

  public isNegative(): boolean {
    return this.value < 0n;
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

  public asOtherPrecision(other: BigUnit): BigUnit {
    // Express the value as a BigUnit with the given precision
    return this.asPrecision(other.precision);
  }

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
   * @dev Convert to a string representation of the value, using fixed-point notation.
   */
  public toString(): string {
    const valueString = this.value.toString();

    // If the precision is zero, return the value as a string as there are no decimals
    if (this.precision === 0) {
      return valueString;
    }

    // Calculate the index of the decimal point
    const length = valueString.length;

    // If the length is less than the precision, pad with zeros
    if (length < this.precision) {
      const padding = "0".repeat(this.precision - length);
      return `0.${padding}${valueString}`;
    }

    // If the length is greater than the precision, slice the string
    const decimalIndex = length - this.precision;
    const integerPart = valueString.slice(0, decimalIndex);
    const fractionalPart = valueString.slice(decimalIndex);
    return `${integerPart}.${fractionalPart}`;
  }

  public toBigInt(): bigint {
    return this.value;
  }

  public format(precision: number): string {
    return this.toNumber().toFixed(precision);
  }

  public toJSON(): string {
    return JSON.stringify({
      value: this.value.toString(),
      precision: this.precision,
      name: this.name,
    });
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
    return new BigUnit(BigInt(numberValue * 10 ** precision), precision, name);
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

    // If there is no fractional part, return the integer part
    if (!fractionalPart) {
      return new BigUnit(
        integerPartBigInt * BigInt(10 ** precision),
        precision,
        name,
      );
    }

    // Prepare the fractional part string by padding it with zeros to match the precision length
    const paddedFractionalPart = fractionalPart
      .padEnd(precision, "0")
      .slice(0, precision);

    // Convert the padded fractional part to a bigint
    const fractionalPartBigInt = BigInt(paddedFractionalPart);

    // Combine the integer and fractional parts
    const combinedValueBigInt =
      integerPartBigInt * BigInt(10 ** precision) + fractionalPartBigInt;

    // Return the BigUnit
    return new BigUnit(combinedValueBigInt, precision, name);
  }

  public static from(
    value: BigUnitish,
    precision?: number,
    name?: string,
  ): BigUnit {
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

export class BigUnitFactory {
  constructor(
    public precision: number,
    public name?: string,
  ) {
    // throw if precision is not an integer
    if (precision % 1 !== 0) {
      throw new InvalidPrecisionError(precision);
    }
  }

  public from(value: BigUnitish): BigUnit {
    return BigUnit.from(value, this.precision, this.name);
  }

  public fromBigInt(bigintValue: bigint): BigUnit {
    return BigUnit.fromBigInt(bigintValue, this.precision, this.name);
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
