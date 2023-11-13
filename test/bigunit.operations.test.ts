import { BigUnit, DifferentPrecisionError } from "../src/bigunit";

describe("BigUnit Class Methods", () => {
  const precision = 2;
  const unitValue1 = 1000n;
  const unitValue2 = 500n;
  const unitValue3 = -500n;
  const unit1 = new BigUnit(unitValue1, precision);
  const unit2 = new BigUnit(unitValue2, precision);
  const unit3 = new BigUnit(unitValue3, precision);

  describe("add method", () => {
    test("should add two BigUnit instances of the same precision", () => {
      const result = unit1.add(unit2);
      expect(result.value).toBe(unitValue1 + unitValue2);
      expect(result.precision).toBe(precision);
    });

    test("should throw DifferentPrecisionError with two BigUnit instances of different precision", () => {
      const unitDifferentPrecision = new BigUnit(unitValue2, precision + 1);
      const addOperation = () => unit1.add(unitDifferentPrecision);
      expect(addOperation).toThrow(DifferentPrecisionError);
    });

    test("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.add(unit3);
      const zeroResult = unit1.add(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 + unitValue3);
      expect(zeroResult.value).toBe(unitValue1);
    });
  });

  describe("sub method", () => {
    // Repeat the structure of add method tests for sub method
    it("should subtract two BigUnit instances of the same precision", () => {
      const result = unit1.sub(unit2);
      expect(result.value).toBe(unitValue1 - unitValue2);
      expect(result.precision).toBe(precision);
    });
    it("should throw DifferentPrecisionError with two BigUnit instances of different precision", () => {
      const unitDifferentPrecision = new BigUnit(unitValue2, precision + 1);
      const subOperation = () => unit1.sub(unitDifferentPrecision);
      expect(subOperation).toThrow(DifferentPrecisionError);
    });
    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.sub(unit3);
      const zeroResult = unit1.sub(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 - unitValue3);
      expect(zeroResult.value).toBe(unitValue1);
    });
  });

  describe("mul method", () => {
    // Repeat the structure of add method tests for mul method
    it("should multiply two BigUnit instances of the same precision", () => {
      const result = unit1.mul(unit2);
      expect(result.value).toBe(unitValue1 * unitValue2);
      expect(result.precision).toBe(precision);
    });
    it("should throw DifferentPrecisionError with two BigUnit instances of different precision", () => {
      const unitDifferentPrecision = new BigUnit(unitValue2, precision + 1);
      const mulOperation = () => unit1.mul(unitDifferentPrecision);
      expect(mulOperation).toThrow(DifferentPrecisionError);
    });
    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.mul(unit3);
      const zeroResult = unit1.mul(zeroUnit);

      expect(negativeResult.value).toBe(unitValue1 * unitValue3);
      expect(zeroResult.value).toBe(0n);
    });
  });

  describe("div method", () => {
    // Repeat the structure of add method tests for div method
    it("should divide two BigUnit instances of the same precision", () => {
      const result = unit1.div(unit2);
      expect(result.value).toBe(unitValue1 / unitValue2);
      expect(result.precision).toBe(precision);
    });
    it("should throw DifferentPrecisionError with two BigUnit instances of different precision", () => {
      const unitDifferentPrecision = new BigUnit(unitValue2, precision + 1);
      const divOperation = () => unit1.div(unitDifferentPrecision);
      expect(divOperation).toThrow(DifferentPrecisionError);
    });
    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.div(unit3);
      expect(() => unit1.div(zeroUnit)).toThrow();
      expect(negativeResult.value).toBe(unitValue1 / unitValue3);
    });
  });

  describe("mod method", () => {
    // Repeat the structure of add method tests for mod method
    it("should mod two BigUnit instances of the same precision", () => {
      const result = unit1.mod(unit2);
      expect(result.value).toBe(unitValue1 % unitValue2);
      expect(result.precision).toBe(precision);
    });
    it("should throw DifferentPrecisionError with two BigUnit instances of different precision", () => {
      const unitDifferentPrecision = new BigUnit(unitValue2, precision + 1);
      const modOperation = () => unit1.mod(unitDifferentPrecision);
      expect(modOperation).toThrow(DifferentPrecisionError);
    });
    it("should handle negative values and zero correctly", () => {
      const zeroUnit = new BigUnit(0n, precision);
      const negativeResult = unit1.mod(unit3);
      expect(() => unit1.mod(zeroUnit)).toThrow();

      expect(negativeResult.value).toBe(unitValue1 % unitValue3);
    });
  });
});

describe('BigUnit Class Methods - percent and fraction', () => {
    const precision = 2;
    const unitValue = 1000n; // 10.00 when precision is 2
    const bigUnit = new BigUnit(unitValue, precision);
  
    describe('percent method', () => {
      test('should calculate the percent correctly with a valid percentage', () => {
        const percentValue = 50; // 50%
        const result = bigUnit.percent(percentValue);
        const expectedValue = 500n; // 50% of 1000n is 500n
  
        expect(result.value).toBe(expectedValue);
        expect(result.precision).toBe(precision);
      });
  
      test('should handle zero percent correctly', () => {
        const percentValue = 0; // 0%
        const result = bigUnit.percent(percentValue);
        const expectedValue = 0n; // 0% of anything is 0n
  
        expect(result.value).toBe(expectedValue);
      });
  
      test('should handle negative percent correctly', () => {
        const percentValue = -50; // -50%
        const result = bigUnit.percent(percentValue);
        const expectedValue = -500n; // -50% of 1000n is -500n
  
        expect(result.value).toBe(expectedValue);
      });
    });
  
    describe('fraction method', () => {
      test('should calculate the fraction correctly with valid numerator and denominator', () => {
        const numerator = 1;
        const denominator = 4; // 1/4
        const result = bigUnit.fraction(numerator, denominator);
        const expectedValue = 250n; // 1/4 of 1000n is 250n
  
        expect(result.value).toBe(expectedValue);
        expect(result.precision).toBe(precision);
      });
  
      test('should handle zero numerator correctly', () => {
        const numerator = 0;
        const denominator = 4; // 0/4
        const result = bigUnit.fraction(numerator, denominator);
        const expectedValue = 0n; // 0/4 of anything is 0n
  
        expect(result.value).toBe(expectedValue);
      });
  
      test('should handle negative numerator correctly', () => {
        const numerator = -1;
        const denominator = 4; // -1/4
        const result = bigUnit.fraction(numerator, denominator);
        const expectedValue = -250n; // -1/4 of 1000n is -250n
  
        expect(result.value).toBe(expectedValue);
      });
  
      test('should handle zero denominator correctly', () => {
        const numerator = 1;
        const denominator = 0; // 1/0 should throw
  
        expect(() => {
          bigUnit.fraction(numerator, denominator);
        }).toThrow();
      });
  
      test('should handle negative denominator correctly', () => {
        const numerator = 1;
        const denominator = -4; // 1/-4
        const result = bigUnit.fraction(numerator, denominator);
        const expectedValue = -250n; // 1/-4 of 1000n is -250n
  
        expect(result.value).toBe(expectedValue);
      });
    });
  });
  