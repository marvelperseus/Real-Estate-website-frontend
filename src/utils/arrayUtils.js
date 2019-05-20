export const includesAny = (array1, array2) => (
  array2.some(item => (
    array1.indexOf(item) !== -1
  ))
);

export const includesAll = (array1, array2) => (
  array2.every(item => (
    array1.indexOf(item) !== -1
  ))
);

export const intersection = (array1, array2) => (
  array1.filter(n => (
    array2.indexOf(n) !== -1
  ))
);

export const difference = (array1, array2) => (
  array1
    .filter(x => !array2.includes(x))
    .concat(array2.filter(x => !array1.includes(x)))
);
