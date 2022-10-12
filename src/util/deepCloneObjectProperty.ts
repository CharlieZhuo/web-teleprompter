export function deepCloneObjectProperty(input: any) {
  const output = {};
  for (const key in input) {
    switch (typeof input[key]) {
      case "object":
        if (typeof input[key] === "object") {
          Object.defineProperty(
            output,
            key,
            deepCloneObjectProperty(input[key])
          );
        }
        break;

      case "function":
      case "symbol":
      case "undefined":
        break;

      default:
        Object.defineProperty(output, key, {
          value: input[key],
          writable: true,
        });
        break;
    }
  }
  return output;
}
