import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { MAX_COLLECTION_SIZE } from "@/constants/collection";

export const collectionVstRouter = createTRPCRouter({
  getByCollectionId: publicProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.collectionVst.findMany({
        where: {
          collectionId: input.collectionId,
          deletedAt: null,
        },
        include: {
          vst: true,
        },
      });
    }),

  updateCollectionVst: protectedProcedure
    .input(
      z.object({
        collectionVstId: z.number(),
        collectionId: z.number(),
        order: z.number(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // validate that the user owns the collection
      const collectionVst = await ctx.db.collection.findFirst({
        where: {
          id: input.collectionId,
        },
      });

      if (!collectionVst) {
        throw new Error("Collection not found");
      }

      if (collectionVst.userId !== userId) {
        throw new Error("User does not own collection");
      }

      return ctx.db.collectionVst.update({
        where: {
          id: input.collectionVstId,
        },
        data: {
          order: input.order,
          note: input.note ?? "",
        },
      });
    }),

  rearrangeCollectionVstOrder: protectedProcedure
    .input(
      z.object({ collectionId: z.number(), sequence: z.array(z.number()) }),
    )
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id;

      // validate that the user owns the collection
      const collectionVsts = await ctx.db.collectionVst.findMany({
        where: {
          collectionId: input.collectionId,
        },
      });

      // validate that all ids in sequence are in the collection
      const isValidSequence = input.sequence.every((id) => {
        return collectionVsts.some((v) => v.id === id);
      });

      if (!isValidSequence) {
        throw new Error("Invalid sequence");
      }

      const updatesForTransaction = input.sequence.map((id, index) => {
        const collectionVst = collectionVsts.find((v) => v.id === id);

        if (!collectionVst) {
          throw new Error("CollectionVst not found");
        }

        return ctx.db.collectionVst.update({
          where: {
            id,
          },
          data: {
            order: index,
          },
        });
      });

      const res = await ctx.db.$transaction(updatesForTransaction);

      return res;
    }),

  swapCollectionVstOrder: protectedProcedure
    .input(
      z.object({
        selectedCollectionVst: z.object({
          id: z.number(),
          order: z.number(),
          collectionId: z.number(),
        }),
        adjacentCollectionVst: z.object({
          id: z.number(),
          order: z.number(),
          collectionId: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // validate that the user owns the collection
      const collectionVst = await ctx.db.collection.findFirst({
        where: {
          id: input.selectedCollectionVst.collectionId,
        },
      });

      if (!collectionVst) {
        throw new Error("Collection not found");
      }

      if (collectionVst.userId !== userId) {
        throw new Error("User does not own collection");
      }

      // Validate both collectionVst belong to the same collection
      if (
        input.selectedCollectionVst.collectionId !==
        input.adjacentCollectionVst.collectionId
      ) {
        throw new Error("CollectionVst do not belong to the same collection");
      }

      //
      const first = ctx.db.collectionVst.update({
        where: {
          id: input.selectedCollectionVst.id,
        },
        data: {
          order: input.adjacentCollectionVst.order,
        },
      });

      const second = ctx.db.collectionVst.update({
        where: {
          id: input.adjacentCollectionVst.id,
        },
        data: {
          order: input.selectedCollectionVst.order,
        },
      });

      const res = await ctx.db.$transaction([first, second]);

      return res;
    }),

  getByAuthedUserId: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.userVstAssociation.findMany({
      where: {
        userId,
      },
      include: {
        vst: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        collectionId: z.number(),
        vstId: z.number(),
        order: z.number(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const vstCollectionsCount = await ctx.db.collectionVst.count({
        where: {
          collectionId: input.collectionId,
          deletedAt: null,
        },
      });

      if (vstCollectionsCount >= MAX_COLLECTION_SIZE) {
        throw new Error("Maxiumum collection size reached");
      }

      return ctx.db.collectionVst.create({
        data: {
          order: input.order,
          note: input.note ?? "",
          collectionId: input.collectionId,
          vstId: input.vstId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ collectionVstId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // validate that the user owns the collection
      const collectionVst = await ctx.db.collectionVst.findFirst({
        where: {
          id: input.collectionVstId,
        },
      });

      if (!collectionVst) {
        throw new Error("CollectionVst not found");
      }

      const collection = await ctx.db.collection.findFirst({
        where: {
          id: collectionVst.collectionId,
        },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      if (collection.userId !== userId) {
        throw new Error("User does not own collection");
      }

      return ctx.db.collectionVst.update({
        where: {
          id: input.collectionVstId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
});
