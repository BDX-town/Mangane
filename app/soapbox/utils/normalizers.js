// Use new value only if old value is undefined
export const mergeDefined = (oldVal, newVal) => oldVal === undefined ? newVal : oldVal;
