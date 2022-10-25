export function deepCloneObjectProperty<inputType>(
  input: inputType
): inputType {
  const output = {};
  for (const key in input) {
    switch (typeof input[key]) {
      case "object":
        if (typeof input[key] === "object") {
          const propertyToClone = input[key];
          Object.defineProperty(output, key, {
            value: deepCloneObjectProperty(propertyToClone),
          });
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
  return output as inputType;
}
