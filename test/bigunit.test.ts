import { BigUnit, BigUnitError, BigUnitFactory } from "../src/bigunit";

describe("BigUnit", () => {
  it("should create a BigUnit", () => {
    const bigUnit = new BigUnit(12345n, 3);
    expect(bigUnit).toBeDefined();
  });
  it("should throw if precision is not an integer", () => {
    expect(() => new BigUnit(12345n, 3.5)).toThrow();
  });
  it("should have the correct precision and value", () => {
    const bigUnit = new BigUnit(123456n, 3);
    expect(bigUnit.precision).toEqual(3);
    expect(bigUnit.value).toEqual(123456n);
  });
  it("should format", () => {
    const bigUnit = new BigUnit(123456n, 4);
    expect(bigUnit.format(1)).toEqual("12.3");
    expect(bigUnit.format(2)).toEqual("12.35");
    expect(bigUnit.format(3)).toEqual("12.346");
  });
  it("should add", () => {
    const a = new BigUnit(123n, 3);
    const b = new BigUnit(456n, 3);
    const c = a.add(b);
    expect(c.value).toEqual(579n);
    expect(c.precision).toEqual(3);
  });
  it("should subtract", () => {
    const a = new BigUnit(123n, 3);
    const b = new BigUnit(456n, 3);
    const c = a.sub(b);
    expect(c.value).toEqual(-333n);
    expect(c.precision).toEqual(3);
  });
  it("should multiply", () => {
    const a = new BigUnit(123n, 3);
    const b = new BigUnit(200n, 3);
    const c = a.mul(b);
    expect(c.value).toEqual(24600n);
    expect(c.precision).toEqual(3);
  });
});

describe("BigUnitFactory", () => {
  it("should create a BigUnit factory", () => {
    const bigUnitFactory = new BigUnitFactory("BTC", 8);
    expect(bigUnitFactory).toBeDefined();
  });
  it("should throw if precision is not an integer", () => {
    expect(() => new BigUnitFactory("BTC", 8.5)).toThrow();
  });
  it("should have the correct properties", () => {
    const bigUnitFactory = new BigUnitFactory("BTC", 8);
    expect(bigUnitFactory.precision).toEqual(8);
    expect(bigUnitFactory.name).toEqual("BTC");
  });
  it("should create a BigUnit from a number", () => {
    const BTC = new BigUnitFactory("BTC", 8);
    const bigUnit = BTC.make(1.5);
    expect(bigUnit).toBeDefined();
    expect(bigUnit.value).toEqual(150000000n);
    expect(bigUnit.precision).toEqual(8);
  });
  it("should create a BigUnit from a string", () => {
    const BTC = new BigUnitFactory("BTC", 8);
    const bigUnit = BTC.make("150000000");
    expect(bigUnit).toBeDefined();
    expect(bigUnit.value).toEqual(150000000n);
    expect(bigUnit.precision).toEqual(8);
  });
  it("should fail to create a BigUnit from a string with a decimal", () => {
    const BTC = new BigUnitFactory("BTC", 8);
    // Expect to throw an instance of BigUnitError
    expect(() => BTC.make("1.5")).toThrow(BigUnitError);
  });
  it("should create a BigUnit from another BigUnit", () => {
    const BTC = new BigUnitFactory("BTC", 8);
    const bigUnit = BTC.make(1.5);
    expect(bigUnit).toBeDefined();
    expect(bigUnit.value).toEqual(150000000n);
    expect(bigUnit.precision).toEqual(8);
  });
});
