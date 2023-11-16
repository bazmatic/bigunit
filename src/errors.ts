// Errors
export class BigUnitError extends Error {
  constructor(
    public message: string,
    public cause?: string,
    public data?: any,
  ) {
    super(message);
    this.name = BigUnitError.name;
  }
}

export class DifferentPrecisionError extends BigUnitError {
  constructor(operation: string, precisionA: number, precisionB: number) {
    super(
      `Cannot perform ${operation} operation on two units of different precision`,
      `${precisionA}, ${precisionB}`,
    );
  }
}

export class InvalidValueTypeError extends BigUnitError {
  constructor(value: unknown) {
    super(`Invalid value type: ${typeof value}`);
  }
}

export class MissingPrecisionError extends BigUnitError {
  constructor() {
    super("Missing precision");
  }
}

export class InvalidPrecisionError extends BigUnitError {
  constructor(precision: number) {
    super(`Invalid precision: ${precision}`);
  }
}

export class DivisionByZeroError extends BigUnitError {
  constructor() {
    super("Division by zero");
  }
}

export class InvalidFractionError extends BigUnitError {
  constructor(message: string) {
    super(message);
  }
}
