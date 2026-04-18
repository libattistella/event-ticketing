import { OPTION_CODE_LABELS, OPTION_LABELS } from "./constants";

export const formatCents = (cents: number, currency = "EUR"): string => {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

export function formatOptionLabel(code: string, value: string): string {
  const label = OPTION_LABELS[code]?.[value];
  if (label) return label;
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatOptionCode(code: string): string {
  const label = OPTION_CODE_LABELS[code];
  if (label) return label;
  return code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
