# BigUnit

## Overview
The `BigUnit` package is a TypeScript library designed to manage numbers of varying precision, such as cryptocurrencies.

# BigUnitish Type
Represents a type that can be converted to a `BigUnit` if a precision value is available. It can be a number, string, bigint, or `BigUnit` itself.

# BigUnit Class

## Methods

### constructor(value: bigint, precision: number, name?: string)`
Constructs a new instance of `BigUnit` from a `bigint`. BigUnit instances can also be instantiated with the static factory methods `from`, `fromBigInt`, `fromNumber`, `fromDecimalString`, `fromValueString`, and `fromObject`.

### add(other: BigUnitish): BigUnit
Adds the provided `BigUnitish` value to the current instance.

### sub(other: BigUnitish): BigUnit
Subtracts the provided `BigUnitish` value from the current instance.

### mul(other: BigUnitish): BigUnit
Multiplies the current instance with the provided `BigUnitish` value.

### div(other: BigUnitish): BigUnit
Divides the current instance by the provided `BigUnitish` value.

### mod(other: BigUnitish): BigUnit
Calculates the modulo of the current instance by the provided `BigUnitish` value.

### abs(): BigUnit
Returns the absolute value of the current instance.

### neg(): BigUnit
Negates the current instance.

### fraction(numerator: number, denominator: number): BigUnit
Calculates the fraction of the current instance based on the provided numerator and denominator.

### percent(percent: number): BigUnit
Calculates the percentage of the current instance based on the provided percent value.

### eq(other: BigUnitish): boolean
Checks equality between the current instance and the provided `BigUnitish` value.

### gt(other: BigUnitish): boolean
Checks if the current instance is greater than the provided `BigUnitish` value.

### lt(other: BigUnitish): boolean
Checks if the current instance is less than the provided `BigUnitish` value.

### gte(other: BigUnitish): boolean
Checks if the current instance is greater than or equal to the provided `BigUnitish` value.

### lte(other: BigUnitish): boolean
Checks if the current instance is less than or equal to the provided `BigUnitish` value.

### isZero(): boolean
Checks if the current instance is zero.

### isPositive(): boolean
Checks if the current instance is positive.

### isNegative(): boolean
Checks if the current instance is negative.

### asPrecision(precision: number): BigUnit
Converts the current instance to a specified precision.

### asOtherPrecision(other: BigUnit): BigUnit
Converts the current instance to the precision of another `BigUnit`.

### toNumber(): number
Converts the current instance to a number. Some precision may be lost due to the limitations of the `number` type.

### toString(): string
Converts the current instance to a decimal string of the precision of the current instance.

### toBigInt(): bigint
Converts the current instance to a bigint.

### format(precision: number): string
Formats the current instance to a string with the specified precision.

### toJSON(): string
Converts the current instance to a JSON string.

### toObject(): IBigUnitObject
Converts the current instance to an object.

### toValueString(): string
Converts the current instance to its internal string representation.

## Static Methods

### max(unit1: BigUnit, unit2: BigUnit): BigUnit
Returns the maximum of two `BigUnit` instances.

### min(unit1: BigUnit, unit2: BigUnit): BigUnit
  Returns the minimum of two `BigUnit` instances.

### asHighestPrecision(unit1: BigUnit, unit2: BigUnit): [BigUnit, BigUnit]
Converts two `BigUnit` instances to their highest common precision.

### fromBigInt(bigintValue: bigint, precision: number, name?: string): BigUnit
Creates a `BigUnit` instance from a bigint and a precision. Optionally accepts a name for the unit.

### fromNumber(numberValue: number, precision: number, name?: string): BigUnit
Creates a `BigUnit` instance from a number. Optionally accepts a name for the unit.

### fromValueString(valueString: string, precision: number, name?: string): BigUnit
Creates a `BigUnit` instance from a string representing a bigint. Optionally accepts a name for the unit.

### fromObject(obj: IBigUnitObject): BigUnit
Creates a `BigUnit` instance from an object. Optionally accepts a name for the unit.

### fromDecimalString(decimalStringValue: string, precision: number, name?: string): BigUnit
Creates a `BigUnit` instance from a decimal string. Optionally accepts a name for the unit.

### from(value: BigUnitish, precision?: number, name?: string): BigUnit
Creates a `BigUnit` instance from a `BigUnitish` value. Optionally accepts a name for the unit.

# BigUnitFactory
This class is used to create `BigUnit` instances with the same precision and name.

## Methods

### constructor(precision: number, name?: string)`
Constructs a new instance of `BigUnitFactory`. Any `BigUnit` instances created will share the same `precision` and `name` attributes. The `name` attribute is optional.

### from(value: BigUnitish): BigUnit
Creates a `BigUnit` instance from a `BigUnitish` value, using the precision value of the BigUnitFactory instance. Use the name of the BigUnitFactory instance as the name of the created `BigUnit` instance, if it is defined.

### fromBigInt(bigintValue: bigint): BigUnit
  Creates a `BigUnit` instance from a bigint, using the precision value of the BigUnitFactory instance. Use the name of the BigUnitFactory instance as the name of the created `BigUnit` instance, if it is defined.

### fromValueString(valueString: string): BigUnit
  Creates a `BigUnit` instance from a string representing a bigint, using the precision value of the BigUnitFactory instance. Use the name of the BigUnitFactory instance as the name of the created `BigUnit` instance, if it is defined.

### fromNumber(numberValue: number): BigUnit
  Creates a `BigUnit` instance from a number, using the precision value of the BigUnitFactory instance. Use the name of the BigUnitFactory instance as the name of the created `BigUnit` instance, if it is defined.

### fromDecimalString(decimalStringValue: string): BigUnit
  Creates a `BigUnit` instance from a decimal string, using the precision value of the BigUnitFactory instance. Use the name of the BigUnitFactory instance as the name of the created `BigUnit` instance, if it is defined.

## Errors
The package defines several custom errors for handling invalid operations and inputs:

- `DivisionByZeroError`
- `InvalidFractionError`
- `InvalidPrecisionError`
- `InvalidValueTypeError`
- `MissingPrecisionError`

These errors help in identifying and resolving issues related to arithmetic operations and type handling within the `BigUnit` package.
