import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { sendMessage } from "@/server/messaging/send";
import { UserCollectionAssociation } from "@prisma/client";

export const userCollectionRouter = createTRPCRouter({
  getByCollectionId: protectedProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const res = await ctx.db.userCollectionAssociation.findFirst({
        where: {
          collectionId: input.collectionId,
          userId: user.id,
        },
      });

      if (!res) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Association not found",
        });
      }

      return res;
    }),

  /**
   * Toggle a stat on a collection
   */
  toggleStat: protectedProcedure
    .input(
      z.object({
        collectionId: z.number(),
        stat: z.enum(["likesAt"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const userIdColIdFindByIndex = {
        userId_collectionId: {
          userId: user.id,
          collectionId: input.collectionId,
        },
      };

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const existingAssociation =
        await ctx.db.userCollectionAssociation.findUnique({
          where: userIdColIdFindByIndex,
        });

      let res;

      // Toggle off
      if (existingAssociation && existingAssociation[input.stat]) {
        res = await ctx.db.userCollectionAssociation.update({
          where: {
            userId_collectionId: {
              userId: user.id,
              collectionId: input.collectionId,
            },
          },
          data: {
            [input.stat]: null,
          },
        });
      }

      // Toggle on
      if (existingAssociation && !existingAssociation[input.stat]) {
        res = await ctx.db.userCollectionAssociation.update({
          where: userIdColIdFindByIndex,
          data: {
            [input.stat]: new Date(),
          },
        });

        // Send message to SQS
      }

      if (!existingAssociation) {
        res = await ctx.db.userCollectionAssociation.create({
          data: {
            collectionId: input.collectionId,
            userId: user.id,
            [input.stat]: new Date(),
          },
        });
      }

      await sendMessage("collectionLikesAt", res as UserCollectionAssociation);

      return res;
    }),
});
