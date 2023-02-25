export const cx = (...classes: (boolean | string)[]) =>
  classes.filter(Boolean).join(' ');
