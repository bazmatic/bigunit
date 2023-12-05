// Helper function to convert a number to a decimal string to avoid precision loss.
export function numberToDecimalString(num: number): string {
  // Check if the number is in scientific notation
  const numString = num.toString();
  if (!/e/i.test(numString)) {
    return numString;
  }

  // Split into base and exponent
  const [base, exponent] = numString
    .split("e")
    .map((part) => parseInt(part, 10));
  const baseString = Math.abs(base).toString();

  // Handle positive and negative exponents
  if (exponent > 0) {
    return baseString.padEnd(exponent + baseString.length, "0");
  } else {
    return "0." + "0".repeat(Math.abs(exponent) - 1) + baseString;
  }
}

export function bigintCloseTo(
  a: bigint,
  b: bigint,
  tolerance: bigint,
): boolean {
  return a >= b - tolerance && a <= b + tolerance;
}
