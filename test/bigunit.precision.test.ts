import { BigUnit } from "../src/bigunit";

describe('BigUnit Class Precision Conversion Methods', () => {
    const initialPrecision = 2;
    const initialVal = 12345n; // Represents 123.45 when precision is 2
    const bigUnit = new BigUnit(initialVal, initialPrecision);
  
    describe('asPrecision method', () => {
      test('should return a BigUnit with the same precision when converted to the same precision', () => {
        const newUnit = bigUnit.asPrecision(initialPrecision);
        expect(newUnit.precision).toBe(initialPrecision);
        expect(newUnit.value).toBe(initialVal);
      });
  
      test.only('should return a BigUnit with a higher precision when converted to a higher precision', () => {
        const higherPrecision = 4;
        const newUnit = bigUnit.asPrecision(higherPrecision);
        const expectedValue = initialVal * 100n; // Adjusting for the 2 decimal places increase in precision
        expect(newUnit.precision).toBe(higherPrecision);
        expect(newUnit.value).toBe(expectedValue);
      });
  
      test('should return a BigUnit with a lower precision when converted to a lower precision', () => {
        const lowerPrecision = 0;
        const newUnit = bigUnit.asPrecision(lowerPrecision);
        const expectedValue = initialVal / 100n; // Adjusting for the 2 decimal places decrease in precision
        expect(newUnit.precision).toBe(lowerPrecision);
        expect(newUnit.value).toBe(expectedValue);
      });
    });
  
    describe('asOtherPrecision method', () => {
      test('should convert to the same precision when the other BigUnit has the same precision', () => {
        const otherUnit = new BigUnit(6789n, initialPrecision);
        const newUnit = bigUnit.asOtherPrecision(otherUnit);
        expect(newUnit.precision).toBe(initialPrecision);
        expect(newUnit.value).toBe(initialVal);
      });
  
      test('should convert to a higher precision when the other BigUnit has a higher precision', () => {
        const otherUnit = new BigUnit(6789n, 4); // higher precision
        const newUnit = bigUnit.asOtherPrecision(otherUnit);
        const expectedValue = initialVal * 100n; // Adjusting for the precision difference
        expect(newUnit.precision).toBe(otherUnit.precision);
        expect(newUnit.value).toBe(expectedValue);
      });
  
      test('should convert to a lower precision when the other BigUnit has a lower precision', () => {
        const otherUnit = new BigUnit(67n, 0); // lower precision
        const newUnit = bigUnit.asOtherPrecision(otherUnit);
        const expectedValue = initialVal / 100n; // Adjusting for the precision difference
        expect(newUnit.precision).toBe(otherUnit.precision);
        expect(newUnit.value).toBe(expectedValue);
      });
    });
  });
  