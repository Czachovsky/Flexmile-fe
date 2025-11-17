export function enumToList<T extends Record<string, string>>(enumObj: T) {
  return Object.entries(enumObj).map(([key, value]) => ({
    value: key,
    label: value,
  }));
}
