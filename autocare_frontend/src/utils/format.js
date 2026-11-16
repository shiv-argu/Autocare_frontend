export const money = (x) =>
  x === null || x === undefined || x === ''
    ? '—'
    : Number(x).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


