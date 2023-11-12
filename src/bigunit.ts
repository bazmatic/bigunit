// Errors
export class BigUnitError extends Error {
  constructor(
    public message: string,
    public cause?: string,
    public data?: any,
  ) {
    super(`${message} ${cause ? ": " + cause : ""}`);
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

export class BigUnit {

  constructor(
    public value: bigint,
    public precision: number,
  ) {
    // throw if precision is not an integer
    if (precision % 1 !== 0) {
      throw new Error("precision must be an integer");
    }
  }

  public add(other: BigUnit): BigUnit {
    // If the other unit is not the same precision, throw
    if (this.precision !== other.precision) {
      throw new DifferentPrecisionError(
        this.add.name,
        this.precision,
        other.precision,
      );
    }
    // Add the values
    return new BigUnit(this.value + other.value, this.precision);
  }

  public sub(other: BigUnit): BigUnit {
    // If the other unit is not the same precision, throw
    if (this.precision !== other.precision) {
      throw new DifferentPrecisionError(
        this.sub.name,
        this.precision,
        other.precision,
      );
    }
    // Subtract the values
    return new BigUnit(this.value - other.value, this.precision);
  }

  public mul(other: BigUnit): BigUnit {
    // If the other unit is not the same precision, throw
    if (this.precision !== other.precision) {
      throw new DifferentPrecisionError(
        this.mul.name,
        this.precision,
        other.precision,
      );
    }
    // Multiply the values
    return new BigUnit(this.value * other.value, this.precision);
  }

  public div(other: BigUnit): BigUnit {
    // If the other unit is not the same precision, throw
    if (this.precision !== other.precision) {
      throw new DifferentPrecisionError(
        this.div.name,
        this.precision,
        other.precision,
      );
    }
    // Divide the values
    return new BigUnit(this.value / other.value, this.precision);
  }

  public mod(other: BigUnit): BigUnit {
    // If the other unit is not the same precision, throw
    if (this.precision !== other.precision) {
      throw new DifferentPrecisionError(
        this.mod.name,
        this.precision,
        other.precision,
      );
    }
    // Mod the values
    return new BigUnit(this.value % other.value, this.precision);
  }

  public percent(percent: number): BigUnit {
    return this.fraction(percent, 100);
  }

  public fraction(numerator: number, denominator: number): BigUnit {
    // Calculate the fraction of the value and return a new BigUnit
    const fractionValue = this.value * BigInt(numerator) / BigInt(denominator);
    return new BigUnit(fractionValue, this.precision);
  }

  public eq(other: BigUnit): boolean {
    return this.value == other.asPrecision(this.precision).value;
  }

  public gt(other: BigUnit): boolean {
    return this.value > other.asPrecision(this.precision).value;
  }

  public lt(other: BigUnit): boolean {
    return this.value < other.asPrecision(this.precision).value;
  }

  public gte(other: BigUnit): boolean {
    return this.value >= other.asPrecision(this.precision).value;
  }

  public lte(other: BigUnit): boolean {
    return this.value <= other.asPrecision(this.precision).value;
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

  public asPrecision(precision: number): BigUnit {
    // Express the value as a BigUnit with the given precision
    const newValue = this.value * 10n ** BigInt(precision - this.precision);
    return new BigUnit(newValue, precision);
  }

  public asOtherPrecision(other: BigUnit): BigUnit {
    // Express the value as a BigUnit with the given precision
    return this.asPrecision(other.precision);
  }

  public toNumber(): number {
    return Number(this.value) / 10 ** this.precision;
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
}

export class BigUnitFactory {
  constructor(
    public name: string,
    public precision: number,
  ) {
    // throw if precision is not an integer
    if (precision % 1 !== 0) {
      throw new Error("precision must be an integer");
    }
  }

  public fromNumber(numberValue: number): BigUnit {
    return new BigUnit(
      BigInt(numberValue * 10 ** this.precision),
      this.precision,
    );
  }

  /**
   * @dev Convert a decimal string to a BigUnit
   * @param decimalStringValue 
   */
  public fromDecimalString(decimalStringValue: string): BigUnit {
    // Split the string into integer and fractional parts
    const [integerPart, fractionalPart] = decimalStringValue.split(".");

    // Convert the integer part to a bigint
    const integerPartBigInt = BigInt(integerPart);

    // If there is no fractional part, return the integer part
    if (!fractionalPart) {
      return new BigUnit(integerPartBigInt, this.precision);
    }

    // Convert the fractional part to a bigint
    let fractionalPartBigInt = BigInt(fractionalPart);

    // If the fractional part is longer than the precision, truncate it with a warning
    if (fractionalPartBigInt.toString().length > this.precision) {
      console.warn(
        `Truncating fractional part of ${decimalStringValue} to ${this.precision} digits`,
      );
      const fractionalPartString = fractionalPartBigInt.toString();
      fractionalPartBigInt = BigInt(
        fractionalPartString.slice(0, this.precision),
      );
    }

    // Pad the fractional part with zeros if it is shorter than the precision
    const fractionalPartString = fractionalPartBigInt.toString();
    const fractionalPartLength = fractionalPartString.length;
    if (fractionalPartLength < this.precision) {
      const padding = "0".repeat(this.precision - fractionalPartLength);
      fractionalPartBigInt = BigInt(`${fractionalPartString}${padding}`);
    }

    // Combine the integer and fractional parts
    const valueBigInt = BigInt(
      `${integerPartBigInt}${fractionalPartBigInt}`,
    );

    // Return the BigUnit
    return new BigUnit(valueBigInt, this.precision);
  }

  public fromBigInt(bigintValue: bigint): BigUnit {
    return new BigUnit(bigintValue, this.precision);
  }

  public make(value: BigUnitish): BigUnit {
    if (typeof value === "number") {
      return this.fromNumber(value);
    } else if (typeof value === "string") {
      return this.fromDecimalString(value);
    } else if (typeof value === "bigint") {
      return this.fromBigInt(value);
    } else if (value instanceof BigUnit) {
      // Convert other BigUnit to my precision
      const otherValue: bigint = value.asPrecision(this.precision).value;
      return this.fromBigInt(otherValue);
    } else {
      throw new Error("Invalid value type");
    }
  }
}

export type BigUnitish = number | string | BigUnit;
