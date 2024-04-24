export const isNotNull = (str: string): boolean =>
  typeof str !== "undefined" && str !== null;

export const isEmpty = (str: string): boolean =>
  isNotNull(str) && str.length === 0 || isNotNull(str) && str.replace(/\s/g, '').length === 0;

