import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { zCurrency } from "@/constants/zod/curency";

export const whereToFindRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        // vendorName: z.string(),
        vstId: z.number().min(0),
        // price: z.number().min(0).optional(),
        url: z.string(),
        currency: zCurrency,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // user must be logged in
      if (!ctx?.session?.user?.id) {
        throw new Error("You must be logged in to submit a link");
      }

      // Check doesn't already exist for that URL currency combo and vst
      const existing = await ctx.db.whereToFind.findFirst({
        where: {
          url: input.url,
          currency: input.currency,
          vstId: input.vstId,
        },
      });

      if (existing) {
        return existing;
      }

      return await ctx.db.whereToFind.create({
        data: {
          vendorName: "",
          url: input.url,
          vstId: input.vstId,
          // price: input.price,
          currency: input.currency as string,
        },
      });
    }),
});
