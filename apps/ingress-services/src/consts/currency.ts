export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
] as const;

export const currencyMap: Record<
  string,
  (typeof SUPPORTED_CURRENCIES)[number]
> = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
  "¥": "JPY",
  C$: "CAD",
  A$: "AUD",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
  CAD: "CAD",
};
