import { BigUnit } from "../src/bigunit";

describe("BigUnit Class Constructor", () => {
  test("should create a new BigUnit instance with valid arguments", () => {
    const value = 1000n; // bigint value
    const precision = 2;
    const name = "TestUnit";

    const unit = new BigUnit(value, precision, name);

    expect(unit).toBeInstanceOf(BigUnit);
    expect(unit.value).toBe(value);
    expect(unit.precision).toBe(precision);
    expect(unit.name).toBe(name);
  });

  test("should throw an error when non-integer precision is provided", () => {
    const value = 1000n; // bigint value
    const precision = 2.5; // non-integer precision
    const createUnit = () => new BigUnit(value, precision);

    expect(createUnit).toThrow("precision must be an integer");
  });
});
