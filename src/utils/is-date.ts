export const isDate = (date: string | null | Date) => {
  return (date && new Date(date).toLocaleDateString()) ?? "-";
};
