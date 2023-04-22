export const isArray = <T>(maybeArray: T | readonly T[]): maybeArray is T[] => {
  return Array.isArray(maybeArray);
};

export const isSingle = <T>(maybeArray: T | readonly T[]): maybeArray is T => {
  return !Array.isArray(maybeArray);
};
