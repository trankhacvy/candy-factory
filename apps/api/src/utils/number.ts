export const roundNumber = (num: number, precision = 1000) =>
  Math.round((num + Number.EPSILON) * precision) / precision;
