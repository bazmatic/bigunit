import { BigUnit } from "../src/bigunit";

describe("BigUnit Class Comparison Methods", () => {
  const precision = 2;
  const value = 100.0;
  const bigUnit = BigUnit.from(value, precision);

  const sameValueUnit = BigUnit.fromNumber(value, precision);
  const higherValueUnit = BigUnit.fromNumber(value + 100, precision);
  const lowerValueUnit = BigUnit.fromNumber(value - 100, precision);

  describe("eq (equal) method", () => {
    test("should return true for same value", () => {
      expect(bigUnit.eq(sameValueUnit)).toBe(true);
      expect(higherValueUnit.eq(higherValueUnit.toNumber())).toBe(true);
      expect(lowerValueUnit.eq(lowerValueUnit.toString())).toBe(true);
    });

    test("should return false for different values", () => {
      expect(bigUnit.eq(higherValueUnit)).toBe(false);
      expect(bigUnit.eq(lowerValueUnit)).toBe(false);
      expect(higherValueUnit.eq(lowerValueUnit.toNumber())).toBe(false);
    });
  });

  describe("gt (greater than) method", () => {
    test("should return false for same value", () => {
      expect(bigUnit.gt(sameValueUnit)).toBe(false);
      expect(bigUnit.gt(sameValueUnit.toNumber())).toBe(false);
      expect(bigUnit.gt(sameValueUnit.toString())).toBe(false);
    });

    test("should return true for lesser value", () => {
      expect(bigUnit.gt(lowerValueUnit)).toBe(true);
      expect(bigUnit.gt(lowerValueUnit.toNumber())).toBe(true);
      expect(bigUnit.gt(lowerValueUnit.toString())).toBe(true);
    });

    test("should return false for greater value", () => {
      expect(bigUnit.gt(higherValueUnit)).toBe(false);
      expect(bigUnit.gt(higherValueUnit.toNumber())).toBe(false);
      expect(bigUnit.gt(higherValueUnit.toString())).toBe(false);
    });
  });

  describe("lt (less than) method", () => {
    test("should return false for same value", () => {
      expect(bigUnit.lt(sameValueUnit)).toBe(false);
      expect(bigUnit.lt(sameValueUnit.toNumber())).toBe(false);
      expect(bigUnit.lt(sameValueUnit.toString())).toBe(false);
    });

    test("should return false for lesser value", () => {
      expect(bigUnit.lt(lowerValueUnit)).toBe(false);
      expect(bigUnit.lt(lowerValueUnit.toNumber())).toBe(false);
      expect(bigUnit.lt(lowerValueUnit.toString())).toBe(false);
    });

    test("should return true for greater value", () => {
      expect(bigUnit.lt(higherValueUnit)).toBe(true);
      expect(bigUnit.lt(higherValueUnit.toNumber())).toBe(true);
      expect(bigUnit.lt(higherValueUnit.toString())).toBe(true);
    });
  });

  describe("gte (greater than or equal to) method", () => {
    test("should return true for same value", () => {
      expect(bigUnit.gte(sameValueUnit)).toBe(true);
      expect(bigUnit.gte(sameValueUnit.toNumber())).toBe(true);
      expect(bigUnit.gte(sameValueUnit.toString())).toBe(true);
    });

    test("should return true for lesser value", () => {
      expect(bigUnit.gte(lowerValueUnit)).toBe(true);
      expect(bigUnit.gte(lowerValueUnit.toNumber())).toBe(true);
      expect(bigUnit.gte(lowerValueUnit.toString())).toBe(true);
    });

    test("should return false for greater value", () => {
      expect(bigUnit.gte(higherValueUnit)).toBe(false);
      expect(bigUnit.gte(higherValueUnit.toNumber())).toBe(false);
      expect(bigUnit.gte(higherValueUnit.toString())).toBe(false);
    });
  });

  describe("lte (less than or equal to) method", () => {
    test("should return true for same value and precision", () => {
      expect(bigUnit.lte(sameValueUnit)).toBe(true);
      expect(bigUnit.lte(sameValueUnit.toNumber())).toBe(true);
      expect(bigUnit.lte(sameValueUnit.toString())).toBe(true);
    });

    test("should return false for lesser value", () => {
      expect(bigUnit.lte(lowerValueUnit)).toBe(false);
      expect(bigUnit.lte(lowerValueUnit.toNumber())).toBe(false);
      expect(bigUnit.lte(lowerValueUnit.toString())).toBe(false);
    });

    test("should return true for greater value", () => {
      expect(bigUnit.lte(higherValueUnit)).toBe(true);
      expect(bigUnit.lte(higherValueUnit.toNumber())).toBe(true);
      expect(bigUnit.lte(higherValueUnit.toString())).toBe(true);
    });
  });

  test("comparisons with differing precision", () => {
    const unit1 = BigUnit.from("9.1", 1);
    const unit2 = BigUnit.from("9.12", 2);
    const unit3 = BigUnit.from("9.12", 3);

    expect(unit1.gt(unit2)).toBe(false);
    expect(unit2.gt(unit1)).toBe(true);
    expect(unit2.gt(unit3)).toBe(false);
    expect(unit3.gt(unit2)).toBe(false);
    expect(unit1.gt(unit1)).toBe(false);

    expect(unit1.lt(unit2)).toBe(true);
    expect(unit2.lt(unit1)).toBe(false);
    expect(unit2.lt(unit3)).toBe(false);
    expect(unit3.lt(unit2)).toBe(false);
    expect(unit1.lt(unit1)).toBe(false);

    expect(unit1.gte(unit2)).toBe(false);
    expect(unit2.gte(unit1)).toBe(true);
    expect(unit2.gte(unit3)).toBe(true);
    expect(unit3.gte(unit2)).toBe(true);
    expect(unit1.gte(unit1)).toBe(true);

    expect(unit1.lte(unit2)).toBe(true);
    expect(unit2.lte(unit1)).toBe(false);
    expect(unit2.lte(unit3)).toBe(true);
    expect(unit3.lte(unit2)).toBe(true);
    expect(unit1.lte(unit1)).toBe(true);

    expect(unit1.eq(unit2)).toBe(false);
    expect(unit2.eq(unit1)).toBe(false);
    expect(unit2.eq(unit3)).toBe(true);
    expect(unit3.eq(unit2)).toBe(true);
    expect(unit1.eq(unit1)).toBe(true);
  });

  test("comparisons with differing precision, using a precision override", () => {
    // A normal comparison would show one being greater than the other,
    // but with a precision override, they are equal.
    const unit1 = BigUnit.from("9.123", 3);
    const unit2 = BigUnit.from("9.12", 2);

    // Without override
    expect(unit2.eq(unit1)).toBe(false);
    expect(unit2.lt(unit1)).toBe(true);

    // With override
    expect(unit2.eq(unit1, 2)).toBe(true);
    expect(unit2.lt(unit1, 2)).toBe(false);
  });
});
