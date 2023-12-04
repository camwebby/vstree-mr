import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { userSetupSchema } from "@/components/organisms/your-system";

export const userRouter = createTRPCRouter({
  getUserPublic: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const res = await ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          systemOS: true,
          osVersion: true,
          daw: true,
          dawVersion: true,
          systemMemory: true,
          cpuArchitecture: true,
        },
      });

      const collections = await ctx.db.collection.findMany({
        where: {
          userId: input.userId,
          private: false,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          countLikes: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const userVsts = await ctx.db.userVstAssociation.findMany({
        where: {
          userId: input.userId,
        },
        select: {
          vstId: true,
          ownsAt: true,
        },
      });

      return {
        ...res,
        collections,
        userVsts,
      };
    }),

  updateUser: protectedProcedure
    .input(z.object({ userId: z.string(), bio: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      // must be the same user
      if (user.id !== input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id does not match session user",
        });
      }

      const res = await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          bio: input.bio,
        },
      });

      return res;
    }),

  updateUserSetup: protectedProcedure
    .input(userSetupSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session user not found",
        });
      }

      const res = await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          systemOS: input.systemOS,
          osVersion: input.osVersion,
          daw: input.daw,
          dawVersion: input.dawVersion,
          systemMemory: input.systemMemory,
          cpuArchitecture: input.cpuArchitecture,
        },
      });

      return res;
    }),
});
