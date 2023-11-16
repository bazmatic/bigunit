import { BigUnitError } from "../src/errors";

describe("BigUnitError Class", () => {
  test("should instantiate with a message and have the correct properties", () => {
    const message = "Test error message";
    const error = new BigUnitError(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BigUnitError);
    expect(error.message).toBe(message);
    expect(error.name).toBe("BigUnitError");
    expect(error.cause).toBeUndefined();
    expect(error.data).toBeUndefined();
  });

  test("should instantiate with a message and cause and have the correct properties", () => {
    const message = "Test error message";
    const cause = "Test cause";

    const error = new BigUnitError(message, cause);

    expect(error).toBeInstanceOf(BigUnitError);
    expect(error.message).toBe(message);
    expect(error.cause).toBe(cause);
  });
});
