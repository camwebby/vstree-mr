import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { zCurrency } from "vst-utils";
import { WhereToFind } from "vst-database";
import { modelIntMap } from "vst-database/consts";

export const whereToFindRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(
      z.object({
        vstId: z.number().min(0),
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

          currency: input.currency as string,
        },
      });
    }),

  submitNew: protectedProcedure
    .input(
      z.object({
        vstId: z.number().min(0),

        url: z.string(),
        currency: zCurrency,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // user must be logged in
      if (!ctx?.session?.user?.id) {
        throw new Error("You must be logged in to submit a link");
      }

      const existing = await ctx.db.ingressEvent.findFirst({
        where: {
          submittedByUserId: ctx.session.user.id,
          model: modelIntMap["whereToFind"],
          payload: {
            path: ["vstId"],
            equals: input.vstId,
          },
        },
      });

      if (existing) {
        throw new Error("You have already submitted a link for this VST");
      }

      const payload: Partial<WhereToFind> = {
        url: input.url,
        vstId: input.vstId,
        currency: input.currency as string,
        vendorName: "",
      };

      const ingressEvent = await ctx.db.ingressEvent.create({
        data: {
          model: modelIntMap["whereToFind"],
          payload,
          submittedByUserId: ctx.session.user.id,
          url: input.url,
        },
      });

      return ingressEvent;
    }),
});
