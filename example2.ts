import { BigUnit } from "./src/bigunit";

// Instantiate BigUnit instances from various types
const bigUnitFromNumber = BigUnit.from(123.456, 3); // From a number with precision 3
const bigUnitFromString = BigUnit.from("789.0123456789", 18); // From a decimal string with precision 18
const bigUnitFromBigInt = BigUnit.from(123456n, 12); // From BigInt with precision 12

// Output the created instances
console.log(`BigUnit from number: ${bigUnitFromNumber.toString()}`); // Format as a decimal number
console.log(`BigUnit from string: ${bigUnitFromString.format(4)}`); // Format as a string with 4 places after the decimal point
console.log(`BigUnit from BigInt: ${bigUnitFromBigInt.toString()}`);

// Compare BigUnit instances with various types
const comparisonNumber = 123.456;
const comparisonString = "789.012";
const comparisonBigInt = 123456n;

console.log(`Is BigUnit from number equal to ${comparisonNumber}?`, bigUnitFromNumber.eq(comparisonNumber)); // true
console.log(`Is BigUnit from string greater than ${comparisonString}?`, bigUnitFromString.gt(comparisonString)); // false, they are equal
console.log(`Is BigUnit from BigInt less than ${comparisonBigInt}?`, bigUnitFromBigInt.lt(comparisonBigInt)); // false, they are equal

// Comparison with another BigUnit instance
const anotherBigUnit = BigUnit.from(123.450, 3); // Slightly less due to rounding at precision 3

console.log(`Is BigUnit from number greater than or equal to another BigUnit?`, bigUnitFromNumber.gte(anotherBigUnit)); // true
console.log(`Is BigUnit from string less than or equal to another BigUnit?`, bigUnitFromString.lte(anotherBigUnit)); // false
