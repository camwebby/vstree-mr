import { WhereToFind } from "@prisma/client";

export type ScrapeCallback<T> = (wtf: WhereToFind) => Promise<T | null>;
