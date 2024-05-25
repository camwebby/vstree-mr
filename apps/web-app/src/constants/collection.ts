export const MAX_COLLECTION_SIZE = 25;

export const collectionSortOptions = [
  {
    label: "Newest",
    value: "createdAt",
  },
  {
    label: "Most popular",
    value: "countLikes",
  },
  {
    label: "Recently updated",
    value: "updatedAt",
  },
] as const;
