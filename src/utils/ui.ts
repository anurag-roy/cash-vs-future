export const cx = (...classes: (boolean | string)[]) =>
  classes.filter(Boolean).join(' ');

const getPaddedMonth = (monthIndex: number) =>
  (monthIndex + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

export const getExpiryOptions = () => {
  const date = new Date();
  let currentMonthIndex = date.getMonth();
  let currentYear = date.getFullYear();

  const options: string[] = [];

  for (let i = 0; i < 3; i++) {
    options.push(`${currentYear}-${getPaddedMonth(currentMonthIndex)}`);

    currentMonthIndex = currentMonthIndex + 1;
    if (currentMonthIndex > 11) {
      currentMonthIndex = 0;
      currentYear = currentYear + 1;
    }
  }

  return options;
};
