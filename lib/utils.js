
export const toUTCDateString = (dateString) => {
  const date = new Date(dateString);
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcDate.toISOString().split('T')[0];
};