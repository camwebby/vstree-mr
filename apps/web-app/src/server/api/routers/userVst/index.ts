import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { zUserVstCountStats } from "@/constants/zod/vstCountStats";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UserVstAssociation } from "vst-database";
import { sendMessage } from "@/server/messaging/send";
// import { messageTypeCallbackMap } from "@/server/messaging/consts";
// import { messageTypeCallbackMap } from "@/server/messaging/consts";
// import { sendMessage } from "@/server/messaging/send";

// const statMessageTypeMap: Record<
//   z.infer<typeof zUserVstCountStats>,
//   keyof typeof messageTypeCallbackMap
// > = {
//   'likesAt': "userLikesVst",
//   ownsAt: "userOwnsVst",
//   wantsAt: "userWantsVst",
// } as const;

export const userVstRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const res = await ctx.db.userVstAssociation.findMany({
        where: {
          userId,
        },
        include: {
          vst: true,
        },
      });

      return res;
    }),

  getByVstId: protectedProcedure
    .input(z.object({ vstId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const res = await ctx.db.userVstAssociation.findFirst({
        where: {
          vstId: input.vstId,
          userId: user.id,
        },
      });

      if (!res) {
        return null;
      }

      return res;
    }),

  /**
   * Toggle a stat on or off
   */
  toggleStat: protectedProcedure
    .input(
      z.object({
        vstId: z.number(),
        stat: zUserVstCountStats,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const existingAssociation = await ctx.db.userVstAssociation.findUnique({
        where: {
          userId_vstId: {
            userId: user.id,
            vstId: input.vstId,
          },
        },
      });

      let res: UserVstAssociation | undefined;

      // Toggle off
      if (existingAssociation && existingAssociation[input.stat]) {
        res = await ctx.db.userVstAssociation.update({
          where: {
            userId_vstId: {
              userId: user.id,
              vstId: input.vstId,
            },
          },
          data: {
            [input.stat]: null,
          },
        });
      }

      // Toggle on
      if (existingAssociation && !existingAssociation[input.stat]) {
        res = await ctx.db.userVstAssociation.update({
          where: {
            userId_vstId: {
              userId: user.id,
              vstId: input.vstId,
            },
          },
          data: {
            [input.stat]: new Date(),
          },
        });

        // Send message to SQS
      }

      if (!existingAssociation) {
        res = await ctx.db.userVstAssociation.create({
          data: {
            vstId: input.vstId,
            userId: user.id,
            [input.stat]: new Date(),
          },
        });
      }

      res && (await sendMessage(input.stat, res));

      return res;
    }),
});
