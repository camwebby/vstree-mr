import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { collectionCreateZod, updateCollectionZod } from "./types";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { zCurrency } from "vst-utils";
import { WhereToFind } from "vst-database";

export const collectionRouter = createTRPCRouter({
  getActiveSlugs: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ ctx, input }) => {
      return ctx.db.collection.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          slug: true,
        },
        take: input.limit,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const collection = await ctx.db.collection.findFirst({
        where: {
          id: input.id,
          deletedAt: null,
        },
      });

      if (collection?.userId !== userId && collection?.private) {
        return null;
      }

      return collection;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      const collection = await ctx.db.collection.findFirst({
        where: {
          slug: input.slug,
          deletedAt: null,
        },
      });

      if (collection?.userId !== userId && collection?.private) {
        return null;
      }

      return collection;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().nullish(),
        orderBy: z
          .enum(["createdAt", "updatedAt", "name", "slug", "countLikes"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const collections = await ctx.db.collection.findMany({
          where: {
            deletedAt: null,
            private: false,
            // publishedAt: { not: null },
          },

          skip: input.cursor ? 1 : undefined,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          take: input.limit + 1,
          orderBy: {
            [input.orderBy || "createdAt"]: "desc",
          },
        });

        let nextCursor: typeof input.cursor | undefined = undefined;

        if (collections.length > input.limit) {
          const nextItem = collections[collections.length - 1];
          nextCursor = nextItem?.id;
        }

        return { items: collections, nextCursor };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err as string,
        });
      }
    }),

  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sessionUserId = ctx.session?.user.id;

      const collections = await ctx.db.collection.findMany({
        where: {
          userId: input.userId,
          deletedAt: null,
          private: sessionUserId !== input.userId && false,
        },
      });

      return collections;
    }),

  getCommentsByCollectionId: publicProcedure
    .input(
      z.object({
        collectionId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.collectionComment.findMany({
        where: {
          collectionId: input.collectionId,
          deletedAt: null,
        },
      });

      return comments;
    }),

  /**
   * Create comment
   */
  createComment: protectedProcedure
    .input(
      z.object({
        collectionId: z.number(),
        comment: z.string(),
        repliesToId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user?.id) throw new Error("Not logged in");

      try {
        const res = await db.collectionComment.create({
          data: {
            text: input.comment,
            collectionId: input.collectionId,
            repliesToCommentId: input.repliesToId || undefined,
            userId: user.id,
            userName: user.name,
            userIconUrl: user.image,
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
      const user = ctx.session.user;

      if (!user?.id) throw new Error("Not logged in");

      // Validate user owns comment
      const comment = await db.collectionComment.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!comment) throw new Error("Comment not found");

      if (comment.userId !== user.id) throw new Error("Not authorized");

      try {
        const res = await db.collectionComment.update({
          where: {
            id: comment.id,
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

  create: protectedProcedure
    .input(collectionCreateZod)
    .mutation(async ({ ctx, input }) => {
      const slug = input.name.toLowerCase().replace(/\s/g, "-");

      const userId = ctx.session?.user.id;

      const collectionBody = {
        ...input,
        slug,
        publishedAt: new Date(),
        userId,
        userName: ctx.session?.user.name,
      };

      try {
        const collection = await ctx.db.collection.create({
          data: collectionBody,
        });

        return collection;
      } catch (err) {
        // if err is slug already exists
        const slugRelated = (
          err as {
            meta?: { target?: string[] };
          }
        ).meta?.target?.includes("slug");

        if (!slugRelated) throw new Error(err as string);

        // gen 5 random numbers
        const random = Math.floor(Math.random() * 100000);

        // append random numbers to slug
        const newSlug = `${slug}-${random}`;

        // try again
        const collection = await ctx.db.collection.create({
          data: {
            ...collectionBody,
            slug: newSlug,
          },
        });

        return collection;
      }
    }),

  update: protectedProcedure
    .input(updateCollectionZod)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user;

      const collection = await ctx.db.collection.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!collection) throw new Error("Collection not found");
      if (user.id !== collection.userId) throw new Error("Not authorized");

      if (!input.name) {
        input.name = collection.name;
      }

      const updateCollection = await ctx.db.collection.update({
        where: {
          id: input.id,
        },
        data: {
          // ...collection,
          ...input,
        },
      });

      return updateCollection;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user;

      const collection = await ctx.db.collection.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!collection) throw new Error("Collection not found");
      if (user.id !== collection.userId) throw new Error("Not authorized");

      const deleteCollection = await ctx.db.collection.update({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return deleteCollection;
    }),

  findPrices: publicProcedure
    .input(
      z.object({
        vstIds: z.array(z.number()),
        mode: z.enum(["lowest"]),
        currency: zCurrency.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const uniqueVstIds = [...new Set(input.vstIds)];

      if (!uniqueVstIds.length) return [];

      const prices = await Promise.all(
        uniqueVstIds.map(async (vstId) => {
          const wtf = await ctx.db.whereToFind.findMany({
            where: {
              vstId,
              price: { not: null },
              currency: input.currency ?? undefined,
              lastVerifiedAt: { not: null },
            },
          });

          if (!wtf.length) return null;

          if (input.mode === "lowest") {
            const lowest = wtf.reduce((prev, current) => {
              if (!prev.price || !current.price) return prev;
              return prev?.price < current?.price ? prev : current;
            });

            return lowest;
          } else {
            return null;
          }
        }),
      );

      const wtfs = prices.filter((p) => p !== null);

      return wtfs as WhereToFind[];
    }),
});
