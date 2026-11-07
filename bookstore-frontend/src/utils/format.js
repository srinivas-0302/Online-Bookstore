const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
// Converts "2008-08-01" to "1 August 2008"
export const formatDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
// Converts "2026-10-12" to "12 Oct"
export const formatShortDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const formatPrice = (value) => priceFormatter.format(value);

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN") : "-";