export const roundNumber = (num: number) =>
  Math.round((num + Number.EPSILON) * 1000) / 1000;
