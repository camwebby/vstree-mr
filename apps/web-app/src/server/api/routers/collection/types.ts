import { Collection, Vst } from "vst-database";
import { z } from "zod";

export const collectionCreateZod: z.ZodType<
  Pick<Collection, "name" | "private" | "hasOrder" | "description" | "iconUrl">
> = z.object({
  name: z.string(),
  private: z.boolean(),
  hasOrder: z.boolean(),
  description: z.string().nullable(),
  iconUrl: z.string(),
});

export const updateCollectionZod: z.ZodType<
  Partial<
    Pick<
      Collection,
      "name" | "private" | "hasOrder" | "description" | "iconUrl" | "id"
    >
  >
> = z.object({
  id: z.number(),
  name: z.string().optional(),
  iconUrl: z.string().optional(),
  private: z.boolean().optional(),
  hasOrder: z.boolean().optional(),
  description: z.string().optional(),
});
