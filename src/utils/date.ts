export const getTotalDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const twoDigitDay = (day: number): string => {
    return `day${day.toString().padStart(2, '0')}`;
  };