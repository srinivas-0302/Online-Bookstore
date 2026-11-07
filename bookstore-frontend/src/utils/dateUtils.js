// Local date as "YYYY-MM-DD".
// (toISOString() uses UTC, and near midnight in India it can give yesterday's date.)
export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}