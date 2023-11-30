# BigUnit
## A muscular TypeScript library for arithmetic with numbers of varying precision

![BigUnit](https://github.com/bazmatic/bigunit/assets/1154619/6961c772-8902-4f9e-9a19-ca6750747326)

## Overview

BigUnit takes the burden of precision management off your shoulders.

BigUnit is a TypeScript library designed to facilitate the handling of large numbers with varying degrees of precision. This is particularly useful in applications involving cryptocurrency, where precise arithmetic with numbers of various precisions are frequently required. The library offers a suite of tools to perform operations, comparisons and conversions on numbers that require representation as specific precision values.

## Features

- Precision: Numbers are represented internally as `bigint` types, allowing for values of any size or precision. Convert numbers to other precisions easily without changing their value.
- Comparison: Easily compare numbers with standard relational operations that work with any number type.
- Conversion: Convert to/from various formats including numbers, BigInts, and number strings with ease.
- Fraction and percentage calculations: Direct methods to work with fractions and percentages without worrying about precision.
- No more `**` and `Math.pow()` in your code!

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

Documentation here: [Documentation](documentation.md)

Here are some examples of using BigUnit:

### Work with various number types effortlessly

```typescript
import { BigUnit, BigUnitFactory } from "bigunit";

// Instantiate BigUnit instances from various types
const unit1 = BigUnit.from(123.456, 5); // Make a unit with 5 decimals from a number
const unit2 = BigUnit.from("789.012483655091331", 18); // Make a unit with 18 decimals from a number string
const unit3 = BigUnit.from(1234567n, 12); // Make a unit with 12 decimalsFrom BigInt (0.000001234567)

// Output the created instances
console.log(unit1.toString()); // Format as a decimal number
console.log(unit2.format(2)); // Format as a string with 2 places after the decimal point
console.log(unit3.toNumber()); // Output as a number
console.log(unit3.toBigInt()); // Output the underlying bigint representation
console.log(unit3.toJSON()); // Output a JSON representation

// Make several numbers of the same precision
const BTC = new BigUnitFactory(8, "BTC");
const btc1 = BTC.from(123.456); // 123.45600000 BTC
const btc2 = BTC.from("0.00000012"); // 0.00000012 BTC
const btc3 = BTC.from(123456789n); // 12.34567890 BTC

// Comparisons
console.log(`Is btc1 equal to 10.23}?`, btc1.eq(10.23)); // false
console.log(`Is btc1 greater than ${btc2.toNumber()}?`, btc1.gt(btc2)); // true
console.log(`Is btc1 less than ${btc2.toNumber()}?`, btc1.lt(btc2)); // false
console.log(`Is btc1 greater than or equal to ${btc2.toNumber()}?`, btc1.gte(btc2)); // true
console.log(`Is btc1 less than or equal to ${btc2.toNumber()}?`, btc1.lte(btc2)); // false
console.log(`Is btc1 zero?`, btc1.isZero()); // false

// Arithmetic
console.log("Subtraction", btc1.sub(btc2)); 
console.log("Multiplication", btc1.mul(2.0)); 
console.log("Division", btc1.div(100000n)); 
console.log("Modulus", btc1.mod(3)); 
const fee = (btc1.add(btc2).add(btc3).percent(20)); //20% of the total
console.log(`The fee is ${fee.toString()}`); 
```

### Show the value of various crypto-currencies

```typescript
import { BigUnitFactory } from "bigunit";

// Define the BigUnitFactories with the specified precisions for cryptocurrencies and USD
const BTC = new BigUnitFactory(8, "BTC"); // BTC precision
const ETH = new BigUnitFactory(18, "ETH"); // ETH precision
const DOT = new BigUnitFactory(10, "DOT"); // DOT precision
const USD = new BigUnitFactory(4, "USD"); // USD precision

// Crypto balances. 
// You can use .from() to accept any type of number. 
// In this example, we use different methods demonstrate the different ways to instantiate BigUnit instances.
const btcBalance = BTC.fromNumber(0.005); // 0.005 BTC
const ethBalance = ETH.fromBigInt(500000000000000000n); // 0.5 ETH
const dotBalance = DOT.fromDecimalString("10.123456789"); // 10.1234567890 DOT. fromDecimalString permits any number of digits after the decimal point.

// Exchange rates to USD
const btcUsdRate = USD.fromNumber(60000.0); // $60,000 per BTC
const ethUsdRate = USD.fromNumber(2000.0); // $2,000 per ETH
const dotUsdRate = USD.fromNumber(35.0); // $35 per DOT

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
console.log(`Total Crypto Balance in USD: $${totalUsdBalance.format(2)}`);
```




## Contributing

Contributions are welcome!

## License

Distributed under the MIT License.
