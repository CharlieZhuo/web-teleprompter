export default function extractNumber(input: number | string) {
  if (typeof input === "number") {
    return input;
  } else {
    const result = input.match(/[0-9]+/g);
    if (!result) return null;
    else {
      return +result[0];
    }
  }
}
