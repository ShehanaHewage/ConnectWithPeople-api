/**
 * Converts a string from snake_case to camelCase
 */
const snakeToCamel = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Converts a string from camelCase to snake_case.
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Recursively converts all keys in an object from camelCase to snake_case.
 * Skips undefined properties.
 * @param obj The object to convert
 * @returns A new object with all keys converted to snake_case
 */
export const objectToSnakeCaseKeys = <T>(obj: T): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? objectToSnakeCaseKeys(item)
        : item
    );
  }

  if (typeof obj !== "object" || obj === null || obj instanceof Date) {
    return obj; // Return Dates and non-objects as is
  }

  const result: { [key: string]: any } = {};
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      (obj as any)[key] !== undefined
    ) {
      const snakeKey = camelToSnake(key);
      const value = (obj as any)[key];
      result[snakeKey] =
        typeof value === "object" && value !== null && !(value instanceof Date)
          ? objectToSnakeCaseKeys(value)
          : value;
    }
  }
  return result;
};

/**
 * Recursively converts all keys in an object from snake_case to camelCase.
 * Note: `postgres` library usually handles this for query results.
 */
export const objectToCamelCaseKeys = <T>(obj: T): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? objectToCamelCaseKeys(item)
        : item
    );
  }

  if (typeof obj !== "object" || obj === null || obj instanceof Date) {
    return obj;
  }

  const result: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      const value = (obj as any)[key];
      result[camelKey] =
        typeof value === "object" && value !== null && !(value instanceof Date)
          ? objectToCamelCaseKeys(value)
          : value;
    }
  }
  return result;
};
