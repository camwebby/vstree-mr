import { WhereToFind } from "vst-database";

export const getLowestWtfByGroup = (
  currency: string,
  prices: WhereToFind[],
): number => {
  if (!prices?.length) {
    return 0;
  }

  return (
    prices?.reduce((acc: number, curr) => {
      if (curr.currency === currency) {
        return acc + (curr.price ?? 0);
      }
      return acc;
    }, 0) ?? 0
  );
};
