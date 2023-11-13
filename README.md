# BigUnit - High-Precision Arithmetic in TypeScript

Welcome to BigUnit, a TypeScript library designed for high-precision arithmetic operations. 

BigUnit allows you to perform calculations on large floating-point or integer numbers with exact precision, making it perfect for handling crypto-currencies, scientific computing, or any domain where the accuracy of decimal representation is paramount. 

BigUnit allows you to work with different currencies of varying precision, keeping the messy business of handling precision and string formatting encapsulated.


## Features

- **High-Precision Arithmetic**: Perform addition, subtraction, multiplication, and division with big integers without losing precision.
- **Custom Error Handling**: Includes custom error classes to handle precision mismatches gracefully.
- **Precision Conversion**: Easily convert numbers from one precision to another.
- **Flexible Number Input**: Create `BigUnit` instances from numbers, strings, or other `BigUnit` objects with a specified precision.
- **Convenient Formatting**: Convert `BigUnit` instances to numbers, strings, or big integers, and format them as needed.

## Installation

```bash
npm install bigunit 
```
Or if you're using Yarn

```bash
yarn add bigunit
```

## Usage

Here's a quick example to get you started:

```
import { BigUnit, BigUnitFactory } from 'bigunit';

const ETH = new BigUnitFactory('ETH', 18);
const balance = ETH.fromDecimalString('0.023401');
const deposit = ETH.fromDecimalString('0.012020219');
const fee = deposit.percent(5.5);
const newBalance = deposit.plus.balance.sub(fee);
console.log(`${ETH.name} ${newBalance.format(4)}`);
```
Output:
```

```

## API Reference

### BigUnit
Core class for representing and manipulating high-precision numbers.



### BigUnitFactory
Factory class for creating BigUnit instances of a given name and precision.
```
const ETH = new BigUnitFactory('ETH', 18);
const balance = ETH.fromDecimalString('0.023401');
const deposit = ETH.fromDecimalString('0.012020219');
if (deposit.gt(1.2))
const fee = deposit.percent(5.5);
const newBalance = deposit.plus.balance.sub(fee);
```

#### fromNumber(numberValue: number): BigUnit


#### fromDecimalString(bigintStringValue: string): BigUnit

#### fromBigInt(bigintValue: bigint): BigUnit

#### make(value: BigUnitish): BigUnit

### Contributing
We welcome contributions! Please open an issue for any bugs or feature requests, or submit a pull request if you've made improvements.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

