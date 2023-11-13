// Errors
export class BigUnitError extends Error {
  constructor(
    public message: string,
    public cause?: string,
    public data?: any
  ) {
    super(message);
    this.name = BigUnitError.name;
  }
}

export class DifferentPrecisionError extends BigUnitError {
  constructor(operation: string, precisionA: number, precisionB: number) {
    super(
      `Cannot perform ${operation} operation on two units of different precision`,
      `${precisionA}, ${precisionB}`  
      );
  }
}

export class InvalidValueTypeError extends BigUnitError {
  constructor(value: unknown) {
    super(`Invalid value type: ${typeof value}`);
  }
}


export class BigUnit {
  constructor(
    public value: bigint,
    public precision: number,
    public name: string = ""
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
        other.precision
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
        other.precision
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
        other.precision
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
        other.precision
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
        other.precision
      );
    }
    // Mod the values
    return new BigUnit(this.value % other.value, this.precision);
  }

  public percent(percent: number): BigUnit {
    return this.fraction(percent, 100);
  }

  public fraction(numerator: number, denominator: number): BigUnit {
    if (isNaN(numerator) || isNaN(denominator)) {
      throw new Error("Numerator and denominator must be valid numbers");
    }
    // Check for division by zero
    if (denominator === 0) {
      throw new BigUnitError("Denominator cannot be zero");
    }
  
    // Calculate the fraction of the value and return a new BigUnit
    const buNumerator =  BigUnit.from(numerator, this.precision)
    const buDenominator = BigUnit.from(denominator, this.precision);

    return this.mul(buNumerator).div(buDenominator);
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
      throw new Error("precision must be an integer");
    }
  
    // Calculate the scaling factor as a bigint
    const scalingFactor = 10n ** BigInt(Math.abs(this.precision - precision));
  
    // Scale the value up or down based on the new precision
    const newValue = this.precision < precision
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

  public toJSON(): string {
    return JSON.stringify({
      value: this.value.toString(),
      precision: this.precision,
      name: this.name
    });
  }

  //=== Static factory methods

  /**
   * @dev Convert a bigint to a BigUnit
   * @param bigintValue
   */
  public static fromBigInt(bigintValue: bigint, precision: number, name?: string): BigUnit {
    return new BigUnit(bigintValue, precision, name);
  }

  /**
   * @dev Convert a number to a BigUnit
   * @param numberValue
   */
  public static fromNumber(numberValue: number, precision: number, name?: string): BigUnit {
    return new BigUnit(BigInt(numberValue * 10 ** precision), precision, name);
  }

    /**
   * @dev Convert a decimal string to a BigUnit, eg. "1.23456"
   * @param decimalStringValue
   */
  public static fromDecimalString(decimalStringValue: string, precision: number, name?: string): BigUnit {
      // Split the string into integer and fractional parts
      const [integerPart, fractionalPart] = decimalStringValue.split(".");
  
      // Convert the integer part to a bigint
      const integerPartBigInt = BigInt(integerPart);
  
      // If there is no fractional part, return the integer part
      if (!fractionalPart) {
        return new BigUnit(integerPartBigInt, precision);
      }
  
      // Convert the fractional part to a bigint
      let fractionalPartBigInt = BigInt(fractionalPart);
  
      // If the fractional part is longer than the precision, truncate it with a warning
      if (fractionalPartBigInt.toString().length > precision) {
        console.warn(
          `Truncating fractional part of ${decimalStringValue} to ${precision} digits`
        );
        const fractionalPartString = fractionalPartBigInt.toString();
        fractionalPartBigInt = BigInt(
          fractionalPartString.slice(0, precision)
        );
      }
  
      // Pad the fractional part with zeros if it is shorter than the precision
      const fractionalPartString = fractionalPartBigInt.toString();
      const fractionalPartLength = fractionalPartString.length;
      if (fractionalPartLength < precision) {
        const padding = "0".repeat(precision - fractionalPartLength);
        fractionalPartBigInt = BigInt(`${fractionalPartString}${padding}`);
      }
  
      // Combine the integer and fractional parts
      const valueBigInt = BigInt(`${integerPartBigInt}${fractionalPartBigInt}`);
  
      // Return the BigUnit
      return BigUnit.fromBigInt(valueBigInt, precision);
    }

    public static from(value: BigUnitish, precision?: number, name?: string): BigUnit {
      // If the value is already a BigUnit, return it. If precision is provided, convert it to the given precision
      if (value instanceof BigUnit) {
        if (precision === undefined|| precision === value.precision) {
          return value;
        }
        return value.asPrecision(precision);
      }

      // The other constructor methods require a precision
      if (precision === undefined) {
        throw new Error("precision is required");
      }
      
      if (typeof value === "number") {
        return BigUnit.fromNumber(value, precision, name);
      } 
      else if (typeof value === "string") {
        return BigUnit.fromDecimalString(value, precision, name);
      }  
      else if (typeof value === "bigint") {
        return BigUnit.fromBigInt(value, precision, name);
      }
      else {
        throw new InvalidValueTypeError(value);
      }
    }
  
}

export class BigUnitFactory {
  constructor(
    public precision: number,
    public name?: string
  ) {
    // throw if precision is not an integer
    if (precision % 1 !== 0) {
      throw new Error("precision must be an integer");
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
    return BigUnit.fromDecimalString(decimalStringValue, this.precision, this.name);
  }


}

export type BigUnitish = number | string | bigint | BigUnit;
