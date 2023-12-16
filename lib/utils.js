export const toUTCDateString = (dateString) => {
  const date = new Date(dateString);
  const nextDay = new Date(date.setUTCDate(date.getUTCDate()));
  return nextDay.toISOString().split('T')[0];
};