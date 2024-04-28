import { Vst } from "vst-database";
import { z } from "zod";

export const vstCreateZod: z.ZodType<
  Pick<Vst, "name" | "slug" | "isInstrument" | "priceType" | "overview">
> = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  priceType: z.number(),
  isInstrument: z.boolean(),
  overview: z.string().nullable(),
  // version: z.string().optional(),
  // iconUrl: z.string().optional(),
  // releasedDate: z.string().datetime().optional(),
  // officialUrl: z.string().optional(),
  // popularDate: z.string().datetime().optional(),
  // featuredAt: z.string().datetime().optional(),
  // systemRequirements: z.object({}).optional(),
  // tagOne: z.string().optional(),
  // tagTwo: z.string().optional(),
  // tagThree: z.string().optional(),
  // tagFour: z.string().optional(),
  // bundleName: z.string().optional(),
  // audioPreviewWithUrl: z.string().optional(),
  // audioPreviewWithoutUrl: z.string().optional(),
  // complexityRating: z.number().optional(),
  // images: z.object({}).optional(),
  // countLikes: z.number().optional(),
  // countOwns: z.number().optional(),
  // countWants: z.number().optional(),
  // countComments: z.number().optional(),
  // createdAt: z.string().datetime(),
  // updatedAt: z.string().datetime(),
  // deletedAt: z.string().datetime().optional(),
  // creatorId: z.number(),
  // creatorName: z.string().optional(),
});

type VstCountColumn = keyof Pick<
  Vst,
  "countLikes" | "countOwns" | "countComments"
>;

export const vstToggleLikeZod: z.ZodType<{
  id: number;
  stat: VstCountColumn;
}> = z.object({
  id: z.number(),
  stat: z.enum(["countLikes", "countComments"]),
});
