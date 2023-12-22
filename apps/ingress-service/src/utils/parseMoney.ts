type ParsedMoney = {
  value: number | null;
  currency: string | null;
};

export function parseMoney(moneyString?: string): ParsedMoney {
  if (!moneyString) {
    return { value: null, currency: null };
  }

  const cleanedString = moneyString.replace(/\s/g, "");
  const regex = /(\D*)([\d,]*\.?\d{1,2}?)/;
  const match = cleanedString.match(regex);

  if (!match) {
    return { value: null, currency: null };
  }

  const currency = match[1].trim() || null;
  const value = match[2] ? parseFloat(match[2].replace(",", "")) : null;

  return { value, currency };
}
