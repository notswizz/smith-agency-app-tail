export const toUTCDateString = (dateString) => {
  if (!dateString) {
    return null; // Or a default date string if you prefer
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Or a default date string if you prefer
  }

  const nextDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return nextDay.toISOString().split('T')[0];
};
