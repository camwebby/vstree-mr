import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { vstCreateZod } from "./types";
// import {logger} from "vst-utils";

export const vstRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.vst.findMany();
  }),

  getAllPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50),
        cursor: z.number().nullish(),

        /**
         * First bit is for effects
         * Second bit is for instruments
         */
        types:
          // array of bit, with size of 2
          z.array(z.boolean()).min(2).max(2),

        tags: z.array(z.string()).optional(),
        creators: z.array(z.string()).optional(),
        search: z
          .string()
          .optional()
          .transform((val) => val?.toLowerCase().trim()),
        orderBy: z
          .enum(["createdAt", "updatedAt", "name", "slug", "countLikes"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // logger.log("info", "get all paginated", {
      //   input,
      //   session: ctx.session,
      // });

      const findManyClause = {
        where: {
          deletedAt: null,
          isInstrument:
            input.types[0] && input?.types[1]
              ? undefined
              : input.types[0]
              ? false
              : input.types[1]
              ? true
              : undefined,
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        skip: input.cursor ? 1 : undefined,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: input.limit + 1,
        orderBy: {
          [input.orderBy || "countLikes"]: "desc",
        },
      } as const;

      //  clear is instruments if search is not empty
      if (input.search) {
        input.types = [false, false];
      }

      const findManyClauseWithTags = {
        ...findManyClause,
        where: {
          ...findManyClause.where,
          tags: {
            hasSome: input.tags,
          },
        },
      } as const;

      const findManyClauseWithCreators = {
        ...findManyClause,
        where: {
          ...findManyClause.where,
          OR: input.creators?.map((creator) => ({
            creatorName: {
              contains: creator,
              mode: "insensitive",
            },
          })),
        },
      } as const;

      const finalFindManyClause = {
        ...findManyClause,
        where: {
          ...findManyClause.where,
          AND: [
            ...(input.tags?.length ? [findManyClauseWithTags.where] : []),
            ...(input.creators?.length
              ? [findManyClauseWithCreators.where]
              : []),
          ],
        },
      };

      try {
        //@ts-ignore
        const vsts = await ctx.db.vst.findMany(finalFindManyClause);

        let nextCursor: typeof input.cursor | undefined = undefined;

        if (vsts.length > input.limit) {
          const nextItem = vsts[vsts.length - 1];
          nextCursor = nextItem?.id;
        }

        return { items: vsts, nextCursor };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.vst.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getByTags: publicProcedure
    .input(z.object({ tags: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const vsts = await ctx.db.vst.findMany({
        where: {
          tags: {
            hasSome: input.tags,
          },
        },
      });

      if (!vsts.length) {
        return [];
      }

      return vsts;
    }),

  getActiveSlugs: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ ctx, input }) => {
      return ctx.db.vst.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          slug: true,
        },
        take: input.limit,
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.vst.findFirst({
        where: {
          slug: input.slug,
        },
        include: {
          whereToFinds: true,
        },
      });
    }),

  getVstsByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.vst.findMany({
        where: {
          name: {
            contains: input.name,
            mode: "insensitive",
          },
        },
      });
    }),

  getVstsByPopularDate: publicProcedure
    .input(
      z.object({
        popularDate: z.string().datetime(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.vst.findMany({
        where: {
          popularDate: {
            equals: new Date(input.popularDate),
          },
        },
      });
    }),

  getCommentsByVstId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.vstComment.findMany({
        where: {
          vstId: input.id,
        },
      });
    }),

  createVst: protectedProcedure
    .input(z.object({ vst: vstCreateZod }))
    .mutation(({ ctx, input }) => {
      return ctx.db.vst.create({
        data: input.vst,
      });
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        vstId: z.number(),
        comment: z.string(),
        repliesToId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user?.id) throw new Error("Not logged in");

      try {
        const res = await db.vstComment.create({
          data: {
            text: input.comment,
            vstId: input.vstId,
            userId: user.id,
            userName: user.name,
            userIconUrl: user.image,
            repliesToCommentId: input.repliesToId,
          },
        });

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      }
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) throw new Error("Not logged in");

      // validate user owns comment
      const comment = await db.vstComment.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!comment) throw new Error("Comment not found");

      if (comment.userId !== userId) {
        throw new Error("User does not own comment");
      }

      try {
        const res = await db.vstComment.update({
          where: {
            id: input.id,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      }
    }),

  likeComment: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) throw new Error("Not logged in");

      try {
        const res = await db.vstComment.update({
          where: {
            id: input.commentId,
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        });

        // async
        // await db.userVstAssociation.update({
        //   where: {
        //     userId_vstId: {
        //       userId: userId,
        //       vstId: res.vstId,
        //     },
        //   },
        //   data: {
        //     likedCommentIds: {
        //       push: res.id,
        //     },
        //   },
        // });

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      }
    }),
});
