export const formatCents = (cents: number, currency = "EUR"): string => {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
};
