# BigUnit: A muscular TypeScript library for arithmetic with numbers of varying precision

## Overview

BigUnit is a TypeScript library designed to facilitate the handling of large numbers with varying degrees of precision. This is particularly useful in applications involving cryptocurrency, where precise arithmetic with large numbers of various precisions are frequently required. The library offers a suite of tools to perform operations, comparisons and conversions on numbers far beyond the safe integer limits of standard JavaScript.

## Features

- Precision: Numbers are represented internally as `bigint` types, allowing for values of any size or precision. Convert numbers to other precisions easily without changing their value.
- Comparison: Easily compare numbers with standard relational operations that work with any number type.
- Conversion: Convert to/from various formats including numbers, BigInts, and number strings with ease.
- Fraction and percentage calculations: Direct methods to work with fractions and percentages without worrying about precision.

## Installation

To add BigUnit to your project, use the following command:

```sh
npm install bigunit
```

Or, if you prefer using Yarn:

```sh
yarn add bigunit
```

## Usage

Here are some examples of using BigUnit:

### Work with various number types effortlessly

```typescript
import { BigUnit } from "bigunit";

// Instantiate BigUnit instances from various types
const bigUnitFromNumber = BigUnit.from(123.456, 3); // From a number with precision 3
const bigUnitFromString = BigUnit.from("789.012", 18); // From a decimal string with precision 18
const bigUnitFromBigInt = BigUnit.from(123456n, 12); // From BigInt with precision 12

// Output the created instances
console.log(`BigUnit from number: ${bigUnitFromNumber.toString()}`); // Format as a decimal number
console.log(`BigUnit from string: ${bigUnitFromString.format(2)}`); // Format as a string with 2 places after the decimal point
console.log(`BigUnit from BigInt: ${bigUnitFromBigInt.toString()}`);

// Compare BigUnit instances with various types
const comparisonNumber = 123.456;
const comparisonString = "789.012";
const comparisonBigInt = 123456n;

console.log(
  `Is BigUnit from number equal to ${comparisonNumber}?`,
  bigUnitFromNumber.eq(comparisonNumber)
); // true
console.log(
  `Is BigUnit from string greater than ${comparisonString}?`,
  bigUnitFromString.gt(comparisonString)
); // false, they are equal
console.log(
  `Is BigUnit from BigInt less than ${comparisonBigInt}?`,
  bigUnitFromBigInt.lt(comparisonBigInt)
); // false, they are equal

// Comparison with another BigUnit instance
const anotherBigUnit = BigUnit.from(123.45, 3); // Slightly less due to rounding at precision 3

console.log(
  `Is BigUnit from number greater than or equal to another BigUnit?`,
  bigUnitFromNumber.gte(anotherBigUnit)
); // true
console.log(
  `Is BigUnit from string less than or equal to another BigUnit?`,
  bigUnitFromString.lte(anotherBigUnit)
); // false
```

### Show the value of various crypto-currencies

```
import { BigUnitFactory } from "./src/bigunit";

// Define the BigUnitFactories with the specified precisions for cryptocurrencies and USD
const BTC = new BigUnitFactory(8, "BTC"); // BTC precision
const ETH = new BigUnitFactory(18, "ETH"); // ETH precision
const DOT = new BigUnitFactory(10, "DOT"); // DOT precision
const USD = new BigUnitFactory(4, "USD"); // USD precision

// Crypto balances
const btcBalance = BTC.fromNumber(0.005); // 0.005 BTC
const ethBalance = ETH.fromNumber(0.5); // 0.5 ETH
const dotBalance = DOT.fromNumber(10.123456789); // 10.1234567890 DOT

// Exchange rates to USD
const btcUsdRate = USD.fromNumber(60000); // $60,000 per BTC
const ethUsdRate = USD.fromNumber(2000); // $2,000 per ETH
const dotUsdRate = USD.fromNumber(35); // $35 per DOT

// Convert each crypto balance to USD
const btcUsdValue = btcBalance.mul(btcUsdRate).asPrecision(USD.precision);
const ethUsdValue = ethBalance.mul(ethUsdRate).asPrecision(USD.precision);
const dotUsdValue = dotBalance.mul(dotUsdRate).asPrecision(USD.precision);

// Sum the USD values to get the total balance
const totalUsdBalance = btcUsdValue.add(ethUsdValue).add(dotUsdValue);

// Output the balances in USD
console.log(`BTC Balance in USD: $${btcUsdValue.format(2)}`);
console.log(`ETH Balance in USD: $${ethUsdValue.format(2)}`);
console.log(`DOT Balance in USD: $${dotUsdValue.format(2)}`);

// Output the total balance in USD
console.log(
  `Total Crypto Balance in USD: $${totalUsdBalance.format(2)}`
);
```

## Contributing

Contributions are welcome!

## License

Distributed under the MIT License.
