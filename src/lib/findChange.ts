export const findChange = (currentVale: number, oldValue: number): string => {
  const change = (currentVale - (oldValue || 0)) / (oldValue || 1);
  const rounded = change.toFixed(2);
  if (change < 0) return `${rounded}% decreased`;
  return `${rounded}% increased`;
};
