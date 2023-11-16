import { BigUnit, BigUnitFactory } from "../src/bigunit";

// Instantiate BigUnit instances from various types
const unit1 = BigUnit.from(123.456, 5); // Make a unit with 5 decimals from a number
const unit2 = BigUnit.from("789.012", 18); // Make a unit with 18 decimals from a number string
const unit3 = BigUnit.from(1234567n, 5); // Make a unit with 12 decimalsFrom BigInt (12.3456)

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
const btc3 = BTC.from(1234567n); // 12.34567000 BTC

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
